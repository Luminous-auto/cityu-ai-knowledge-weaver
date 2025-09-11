import React, { useEffect } from 'react';
import { Layout, Typography, Alert, Space } from 'antd';
import { AudioOutlined, BulbOutlined, GlobalOutlined } from '@ant-design/icons';
import Transcription from './components/Transcription';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  useEffect(() => {
    console.log('CityU AI Knowledge Weaver 项目初始化成功');
    
    // 检查浏览器兼容性
    const checkBrowserSupport = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('当前浏览器不支持语音识别');
      } else {
        console.log('浏览器支持语音识别功能');
      }
    };
    
    checkBrowserSupport();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ 
        backgroundColor: '#1890ff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AudioOutlined style={{ fontSize: '24px', color: 'white' }} />
          <Title level={2} style={{ 
            color: 'white', 
            margin: 0,
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            CityU AI Knowledge Weaver
          </Title>
        </div>
      </Header>
      
      <Content style={{ 
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* 欢迎信息卡片 */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Title level={2} style={{ 
            color: 'white', 
            textAlign: 'center', 
            marginBottom: '16px',
            fontSize: '28px'
          }}>
            🎓 AI 智能知识编织系统
          </Title>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Text style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.9)',
              display: 'block',
              marginBottom: '8px'
            }}>
              专为城大学生打造的智能语音转写平台
            </Text>
            <Text style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.8)'
            }}>
              支持实时语音识别 · 多语言检测 · 连续录音 · 智能备份
            </Text>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <AudioOutlined style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
              <Text style={{ color: 'white', fontSize: '12px' }}>连续录音</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <GlobalOutlined style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
              <Text style={{ color: 'white', fontSize: '12px' }}>多语言支持</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <BulbOutlined style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
              <Text style={{ color: 'white', fontSize: '12px' }}>智能检测</Text>
            </div>
          </div>
        </div>

        {/* 浏览器兼容性提示 */}
        {!(window.SpeechRecognition || window.webkitSpeechRecognition) && (
          <Alert
            message="浏览器兼容性提示"
            description="当前浏览器不支持语音识别功能，请使用 Chrome、Edge 或 Safari 浏览器以获得最佳体验。"
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        {/* 使用提示 */}
        <Alert
          message="💡 使用提示"
          description={
            <Space direction="vertical" size={4}>
              <Text>• 首次使用需要授权麦克风权限</Text>
              <Text>• 支持长时间连续录音，适合记录整堂课内容</Text>
              <Text>• 系统会自动检测语言并切换识别模式</Text>
              <Text>• 录音内容会自动备份，防止意外丢失</Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
        
        {/* 主要功能组件 */}
        <Transcription />
      </Content>
      
      <Footer style={{ 
        textAlign: 'center',
        backgroundColor: '#001529',
        color: 'rgba(255,255,255,0.8)',
        padding: '24px'
      }}>
        <div>
          <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
            © 2025 City University of Hong Kong Students
          </Text>
        </div>
        <div style={{ marginTop: '8px' }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
            Powered by Web Speech API & AI Language Detection
          </Text>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;