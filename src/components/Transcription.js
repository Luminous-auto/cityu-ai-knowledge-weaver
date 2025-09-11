import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, message, Select, Row, Col, Card, Modal, List, Tag, Spin } from 'antd';
import { AudioOutlined, StopOutlined, BulbOutlined, GlobalOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { franc } from 'franc';
import { extractTerms, translateText, getWikiSummary, searchWikipedia } from '../services/api';
import { saveAs } from 'file-saver';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Graph from 'react-vis-network-graph';

const { TextArea } = Input;
const { Option } = Select;

const Transcription = () => {
  const [transcribedText, setTranscribedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [detectedLang, setDetectedLang] = useState('en-US');
  const [recognition, setRecognition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTerm, setCurrentTerm] = useState('');
  const [summary, setSummary] = useState({ extract: '', url: '', thumbnail: null });
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [globalLoading, setGlobalLoading] = useState(false);

  
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);
  const restartTimeoutRef = useRef(null);



  // 初始化语音识别
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      
      // 配置识别参数
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = detectedLang;
      recognitionInstance.maxAlternatives = 1;

      // 设置事件监听器
      setupRecognitionEvents(recognitionInstance);

      recognitionRef.current = recognitionInstance;
      setRecognition(recognitionInstance);
    } else {
      message.warning('您的浏览器不支持语音识别功能，请使用Chrome、Edge或Safari浏览器');
    }

    // 清理函数
    return () => {
      console.log('清理语音识别资源...');
      
      // 清理定时器
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // 停止并清理识别器
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        } catch (error) {
          console.log('清理识别器时出错:', error);
        }
      }
    };
  }, [detectedLang, isRecording]);

  // 录音时长计时器
  useEffect(() => {
    if (isRecording && sessionStartTime) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, sessionStartTime]);

  // 检测语言
  const detectLanguage = async (text) => {
    if (!text.trim() || text.length < 10) return;
    
    setIsLoading(true);
    try {
      // 使用LibreTranslate API检测语言
      const response = await axios.post('https://libretranslate.de/detect', {
        q: text.slice(-300) // 取最后300个字符进行检测
      }, {
        timeout: 5000 // 5秒超时
      });
      
      const detectedCode = response.data[0]?.language;
      console.log('检测到的语言代码:', detectedCode);
      
      // 语言映射
      let mappedLang = detectedLang; // 保持当前设置
      if (detectedCode === 'en') mappedLang = 'en-US';
      else if (detectedCode === 'zh') mappedLang = 'zh-CN';
      else if (detectedCode === 'ja') mappedLang = 'ja-JP';
      else if (detectedCode === 'ko') mappedLang = 'ko-KR';
      
      if (mappedLang !== detectedLang) {
        setDetectedLang(mappedLang);
        console.log('自动切换语言到:', mappedLang);
        message.success(`自动检测并切换到: ${getLangName(mappedLang)}`);
      }
      
    } catch (error) {
      console.log('API检测失败，使用franc库备选:', error);
      
      // 使用franc作为备选方案
      try {
        const francResult = franc(text);
        console.log('Franc检测结果:', francResult);
        
        let mappedLang = detectedLang;
        if (francResult === 'eng') mappedLang = 'en-US';
        else if (francResult === 'cmn') mappedLang = 'zh-CN';
        else if (francResult === 'yue') mappedLang = 'zh-HK';
        
        if (mappedLang !== detectedLang) {
          setDetectedLang(mappedLang);
          console.log('Franc检测切换语言到:', mappedLang);
          message.info(`备选检测切换到: ${getLangName(mappedLang)}`);
        }
      } catch (francError) {
        console.error('Franc检测也失败:', francError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 获取语言显示名称
  const getLangName = (code) => {
    const langMap = {
      'en-US': 'English',
      'zh-CN': 'Mandarin',
      'zh-HK': 'Cantonese',
      'ja-JP': 'Japanese',
      'ko-KR': 'Korean'
    };
    return langMap[code] || code;
  };

  // 格式化录音时长
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // 开始录音
  const startRecording = async () => {
    if (!recognition) {
      message.error('语音识别未初始化，请刷新页面重试');
      return;
    }

    // 请求麦克风权限
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      message.error('无法访问麦克风，请检查权限设置');
      return;
    }

    try {
      // 更新识别语言
      recognition.lang = detectedLang;
      
      // 启动识别
      recognition.start();
      setIsRecording(true);
      setSessionStartTime(Date.now());
      setRecordingDuration(0);
      
      message.success('开始录音，支持连续记录整堂课内容...', 3);
      console.log('开始录音，语言设置:', detectedLang);
      
    } catch (error) {
      console.error('启动录音失败:', error);
      if (error.name === 'InvalidStateError') {
        message.warning('语音识别已在运行中');
      } else {
        message.error('启动录音失败，请重试');
      }
    }
  };

  // 停止录音 - 极速版
  const stopRecording = () => {
    console.log('🛑 立即停止录音...');
    
    // 立即设置状态为停止
    setIsRecording(false);
    setSessionStartTime(null);
    
    // 立即清除所有定时器
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // 立即停止语音识别
    if (recognitionRef.current) {
      try {
        // 直接停止，不移除监听器
        recognitionRef.current.stop();
        console.log('✅ 语音识别已立即停止');
      } catch (error) {
        console.log('停止识别时出错:', error);
      }
    }
    
    message.success(`录音已停止，共录制 ${formatDuration(recordingDuration)}`);
    
    // 检测语言
    if (transcribedText.trim()) {
      detectLanguage(transcribedText);
    }
  };

  // 设置识别事件监听器的辅助函数
  const setupRecognitionEvents = (recognitionInstance) => {
    // 处理识别结果
    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscribedText(prev => prev + finalTranscript);
        console.log('新增转录文本:', finalTranscript);
      }
    };

    // 处理识别开始
    recognitionInstance.onstart = () => {
      console.log('语音识别已启动，语言:', detectedLang);
    };

    // 处理识别错误
    recognitionInstance.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      
      if (event.error === 'no-speech') {
        console.log('未检测到语音，继续监听...');
        return; // 不显示错误，继续录音
      }
      
      if (event.error === 'network') {
        message.error('网络错误，请检查网络连接');
      } else if (event.error === 'not-allowed') {
        message.error('麦克风权限被拒绝，请允许麦克风访问');
        setIsRecording(false);
      } else {
        message.warning(`语音识别警告: ${event.error}`);
      }
    };

    // 处理识别结束
    recognitionInstance.onend = () => {
      console.log('🔚 语音识别结束');
      
      // 简单检查：只在录音状态时重启
      if (isRecording && recognitionRef.current) {
        console.log('🔄 自动重启语音识别...');
        
        restartTimeoutRef.current = setTimeout(() => {
          if (isRecording && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              console.log('✅ 语音识别已重启');
            } catch (error) {
              if (error.name !== 'InvalidStateError') {
                console.error('重启失败，停止录音');
                setIsRecording(false);
              }
            }
          }
        }, 100); // 减少延迟
      }
    };
  };

  // 清空文本
  const clearText = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有转录文本吗？此操作不可撤销。',
      onOk: () => {
        setTranscribedText('');
        message.info('文本已清空');
      }
    });
  };

  // 下载文本
  const downloadText = () => {
    if (!transcribedText.trim()) {
      message.warning('没有可下载的内容');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `transcription_${timestamp}.txt`;
    
    // 添加元数据
    const metadata = `录制时间: ${new Date().toLocaleString()}\n语言: ${getLangName(detectedLang)}\n字符数: ${transcribedText.length}\n词数: ${transcribedText.trim().split(/\s+/).filter(word => word.length > 0).length}\n\n--- 转录内容 ---\n\n`;
    
    const element = document.createElement('a');
    const file = new Blob([metadata + transcribedText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    message.success('文本已下载');
  };

  // 提取术语
  const handleExtractTerms = async () => {
    setLoading(true);
    try {
      console.log('开始提取术语，文本长度:', transcribedText.length);
      const extractedTerms = await extractTerms(transcribedText);
      console.log('提取到的术语:', extractedTerms);
      setTerms(extractedTerms);
      
      if (extractedTerms.length === 0) {
        message.info('无术语');
      } else {
        message.success(`成功提取 ${extractedTerms.length} 个术语`);
      }
    } catch (error) {
      console.error('术语提取失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理术语点击
  const handleTermClick = async (term) => {
    setCurrentTerm(term);
    setModalVisible(true);
    setSummary({ extract: '正在加载Wikipedia信息...', url: '', thumbnail: null });
    
    try {
      const wikiData = await getWikiSummary(term);
      setSummary(wikiData);
    } catch (error) {
      console.error('获取Wikipedia信息失败:', error);
      setSummary({
        extract: '获取Wikipedia信息失败，请稍后重试。',
        url: `https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(term)}`,
        thumbnail: null,
        title: term,
        lang: 'error'
      });
    }
  };

  // 调试工具：检查重复ID
  const findDuplicateIds = (nodes) => {
    const ids = new Set();
    const duplicates = [];
    for (const node of nodes) {
      if (ids.has(node.id)) {
        duplicates.push(node.id);
      }
      ids.add(node.id);
    }
    if (duplicates.length > 0) {
      console.error("发现重复的节点 ID:", duplicates);
      return duplicates;
    } else {
      console.log("节点 ID 检查通过，没有重复。");
      return [];
    }
  };

  // 构建知识图谱
  const buildKnowledgeGraph = () => {
    try {
      if (terms.length < 2) {
        message.warning('需要至少2个术语才能构建图谱');
        return;
      }

      // 使用术语名称作为唯一ID，避免重复
      const uniqueTerms = [...new Set(terms)]; // 去重
      console.log('去重后的术语:', uniqueTerms);
      
      // 生成完全唯一的ID - 使用随机数+时间戳+索引
      const timestamp = Date.now();
      const randomSeed = Math.random().toString(36).substr(2, 9);
      
      const nodes = uniqueTerms.map((term, index) => ({
        id: `node_${timestamp}_${randomSeed}_${index}`, // 三重保证唯一性
        label: term,
        color: '#1890ff',
        shape: 'dot',
        font: { color: '#000000' },
        title: term // 鼠标悬停显示
      }));
      
      const edges = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
          id: `edge_${timestamp}_${randomSeed}_${i}`, // 边也使用三重保证
          from: nodes[i].id,
          to: nodes[i + 1].id,
          color: '#52c41a',
          arrows: 'to'
        });
      }
      
      // 调试检查
      const duplicateNodes = findDuplicateIds(nodes);
      if (duplicateNodes.length > 0) {
        console.error('节点ID重复，取消更新');
        message.error('图谱构建失败：节点ID重复');
        return;
      }
      
      console.log('准备更新图谱数据:', { nodes, edges });
      
      // 先完全清空，然后设置新数据
      setGraphData({ nodes: [], edges: [] });
      
      // 使用更长的延迟确保清空完成
      setTimeout(() => {
        setGraphData({ nodes, edges });
        console.log('图谱数据已更新');
        message.success('知识图谱构建成功');
      }, 200);
      
    } catch (error) {
      console.error('构建图谱错误:', error);
      message.error('图谱构建失败: ' + error.message);
    }
  };

  // 自动翻译文本
  const autoTranslate = async (text, lang) => {
    if (!text.trim() || lang === 'auto') return;
    
    try {
      console.log('自动翻译，目标语言:', lang);
      const translated = await translateText(text, lang);
      console.log('翻译完成:', translated);
      setTranslatedText(translated);
      
      if (translated) {
        console.log('翻译成功');
      }
    } catch (error) {
      console.error('自动翻译失败:', error);
    }
  };

  // 监听转录文本和目标语言变化，自动翻译
  useEffect(() => {
    if (transcribedText.trim() && targetLang !== 'auto') {
      // 延迟翻译，避免频繁调用
      const timer = setTimeout(() => {
        autoTranslate(transcribedText, targetLang);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setTranslatedText('');
    }
  }, [transcribedText, targetLang]);



  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AudioOutlined style={{ color: '#1890ff' }} />
          <span>智能语音转写系统</span>
          {isLoading && <Spin size="small" />}
          {isRecording && (
            <Tag color="green">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: '#52c41a', 
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }} />
                {formatDuration(recordingDuration)}
              </div>
            </Tag>
          )}
        </div>
      }
      style={{ margin: '16px 0' }}

    >
      <Row gutter={[16, 16]}>
        {/* 控制按钮区域 */}
        <Col span={24}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              type="primary"
              icon={<AudioOutlined />}
              onClick={startRecording}
              disabled={isRecording}
              size="large"
              style={{ 
                backgroundColor: '#52c41a',
                borderColor: '#52c41a',
                fontWeight: 'bold'
              }}
            >
              开始录音
            </Button>
            
            <Button
              danger
              icon={<StopOutlined />}
              onClick={stopRecording}
              disabled={!isRecording}
              size="large"
            >
              停止录音
            </Button>

            <Button
              icon={<BulbOutlined />}
              onClick={clearText}
              disabled={!transcribedText.trim()}
            >
              清空文本
            </Button>

            <Button
              icon={<DownloadOutlined />}
              onClick={downloadText}
              disabled={!transcribedText.trim()}
              type="dashed"
            >
              下载文本
            </Button>

            <Button
              type="primary"
              icon={<BulbOutlined />}
              loading={loading}
              onClick={handleExtractTerms}
              disabled={!transcribedText.trim() || isRecording}
            >
              Extract Terms
            </Button>

            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const currentDate = new Date().toLocaleDateString('zh-CN');
                const md = `# 课堂笔记 - ${currentDate}

## 📝 原文转写
${transcribedText}

## 🌐 中文翻译
${translatedText}

## 🏷️ 学术术语
${terms.map(t => `- **${t}** - [[${t}]]`).join('\n')}

## 📊 统计信息
- 字符数: ${transcribedText.length}
- 词数: ${transcribedText.trim().split(/\s+/).filter(word => word.length > 0).length}
- 术语数: ${terms.length}
- 记录时间: ${currentDate}

---
*由 CityU AI Knowledge Weaver 自动生成*`;
                const blob = new Blob([md], { type: 'text/markdown' });
                saveAs(blob, `课堂笔记_${currentDate.replace(/\//g, '-')}.md`);
                message.success('课堂笔记已导出');
              }}
              disabled={!transcribedText.trim()}
            >
              Export to Markdown
            </Button>

            <Button
              type="primary"
              onClick={buildKnowledgeGraph}
              disabled={terms.length < 2}
            >
              Build Knowledge Graph
            </Button>


          </div>
        </Col>

        {/* 语言选择和状态 */}
        <Col span={24}>
          <Row gutter={16} align="middle">
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GlobalOutlined style={{ color: '#1890ff' }} />
                <span>识别语言:</span>
                <Select
                  value={detectedLang}
                  onChange={(value) => {
                    setDetectedLang(value);
                    console.log('手动设置语言:', value);
                    message.info(`已切换到 ${getLangName(value)}`);
                  }}
                  style={{ width: 150 }}
                  disabled={isRecording}
                >
                  <Option value="en-US">English</Option>
                  <Option value="zh-CN">Mandarin</Option>
                  <Option value="zh-HK">Cantonese</Option>
                  <Option value="ja-JP">Japanese</Option>
                  <Option value="ko-KR">Korean</Option>
                </Select>
                <Tag color="blue">{getLangName(detectedLang)}</Tag>
              </div>
            </Col>
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GlobalOutlined style={{ color: '#52c41a' }} />
                <span>翻译目标:</span>
                <Select
                  value={targetLang}
                  onChange={setTargetLang}
                  style={{ width: 150 }}
                >
                  <Option value="auto">不翻译</Option>
                  <Option value="en">English</Option>
                  <Option value="zh">Chinese</Option>
                  <Option value="yue">Cantonese</Option>
                </Select>
                <Tag color="green">
                  {targetLang === 'auto' ? '不翻译' : 
                   targetLang === 'en' ? 'English' : 
                   targetLang === 'zh' ? 'Chinese' : 'Cantonese'}
                </Tag>
              </div>
            </Col>
          </Row>
        </Col>

        {/* 转写文本显示区域 */}
        <Col span={24}>
          <Row gutter={16}>
            <Col span={translatedText ? 12 : 24}>
              <Card title="Original" size="small">
                <TextArea
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  rows={10}
                  placeholder="转写文本将在这里显示... 
                  
✨ 功能特点：
• 支持连续录音，可记录整堂课内容
• 自动语言检测和切换
• 支持多种语言：中文、英文、粤语、日语、韩语
• 可手动编辑和下载转录结果

🎤 使用提示：
• 请确保麦克风权限已开启
• 建议在安静环境中使用以获得最佳效果"
                  style={{ 
                    fontSize: '14px', 
                    lineHeight: '1.6',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </Card>
            </Col>
            {translatedText && (
              <Col span={12}>
                <Card title="Translated" size="small">
                  <TextArea
                    value={translatedText}
                    onChange={(e) => setTranslatedText(e.target.value)}
                    rows={10}
                    style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      color: '#52c41a'
                    }}
                  />
                </Card>
              </Col>
            )}
          </Row>
        </Col>

        {/* 术语提取结果 */}
        {terms.length > 0 && (
          <Col span={24}>
            <List
              header="提取术语"
              bordered
              dataSource={terms}
              renderItem={(term) => (
                <List.Item>
                  <Tag 
                    color="blue" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTermClick(term)}
                  >
                    {term}
                  </Tag>
                </List.Item>
              )}
              style={{ marginBottom: '16px' }}
            />
          </Col>
        )}

        {/* MD预览 */}
        <Col span={24}>
          <Card title="MD预览" size="small">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {'示例: [[term]] 链接到卡片 (列表点击)'}
            </ReactMarkdown>
          </Card>
        </Col>

        {/* 知识图谱 */}
        <Col span={24}>
          <Card title="知识图谱" size="small">
            <div style={{ height: '300px' }}>
              <Graph 
                key={`graph_${graphData.nodes.length}_${Date.now()}`}
                graph={graphData} 
                options={{ 
                  height: '100%',
                  physics: {
                    enabled: true,
                    stabilization: { iterations: 100 }
                  },
                  nodes: {
                    shape: 'dot',
                    size: 16,
                    font: { size: 12, color: '#000000' },
                    borderWidth: 2,
                    shadow: true
                  },
                  edges: {
                    width: 2,
                    shadow: true,
                    smooth: { type: 'continuous' }
                  }
                }} 
              />
            </div>
          </Card>
        </Col>

        {/* 统计信息 */}
        <Col span={24}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#666'
          }}>
            <span>📊 字符数: <strong>{transcribedText.length}</strong></span>
            <span>📝 词数: <strong>{transcribedText.trim().split(/\s+/).filter(word => word.length > 0).length}</strong></span>
            <span>🏷️ 术语: <strong style={{ color: '#52c41a' }}>{terms.length}</strong></span>
            <span>⏱️ 状态: <strong style={{ color: isRecording ? '#52c41a' : '#1890ff' }}>
              {isRecording ? `录音中 (${formatDuration(recordingDuration)})` : '待机'}
            </strong></span>
          </div>
        </Col>
      </Row>

      {/* Wikipedia知识卡片Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📚</span>
            <span>{currentTerm} - Wikipedia知识卡片</span>
            {summary?.lang && (
              <span style={{ 
                fontSize: '12px', 
                color: '#666',
                backgroundColor: '#f0f0f0',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {summary.lang === 'en' ? '🇺🇸 EN' : summary.lang === 'zh' ? '🇨🇳 ZH' : '🔍'}
              </span>
            )}
          </div>
        }
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={[
          <Button key="search" type="link" 
            onClick={() => window.open(summary?.url || `https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(currentTerm)}`, '_blank')}
          >
            🔗 在Wikipedia中查看
          </Button>,
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {summary?.thumbnail && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img 
                src={summary.thumbnail} 
                alt={currentTerm}
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '150px', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}
          
          <div style={{ 
            fontSize: '14px', 
            lineHeight: '1.6',
            color: '#333'
          }}>
            {typeof summary === 'string' ? (
              <p>{summary}</p>
            ) : (
              <>
                <p>{summary?.extract || '正在加载...'}</p>
                
                {summary?.title && summary.title !== currentTerm && (
                  <div style={{ 
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#f6f8fa',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    <strong>标准名称:</strong> {summary.title}
                  </div>
                )}
                
                {summary?.lang === 'search' && (
                  <div style={{ 
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#fff7e6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#d46b08',
                    border: '1px solid #ffd591'
                  }}>
                    💡 <strong>提示:</strong> 点击下方链接搜索更多相关信息
                  </div>
                )}
                
                {summary?.lang === 'error' && (
                  <div style={{ 
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#fff2f0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#cf1322',
                    border: '1px solid #ffccc7'
                  }}>
                    ⚠️ <strong>错误:</strong> 无法获取Wikipedia信息，请检查网络连接
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default Transcription;