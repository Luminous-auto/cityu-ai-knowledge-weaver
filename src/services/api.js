import axios from 'axios';
import { message } from 'antd';

// 术语过滤函数
function filterTerms(terms) {
  return terms.filter(term => {
    // 过滤条件
    if (!term || typeof term !== 'string') return false;
    
    // 去除首尾空格
    term = term.trim();
    if (term.length === 0) return false;
    
    // 过滤包含特殊字符的术语
    if (term.includes('##')) return false;
    if (term.includes('**')) return false;
    if (term.includes('__')) return false;
    
    // 过滤纯数字
    if (/^\d+$/.test(term)) return false;
    
    // 过滤太短的术语（少于2个字符）
    if (term.length < 2) return false;
    
    // 过滤常见无意义词汇
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
    if (stopWords.includes(term.toLowerCase())) return false;
    
    return true;
  }).map(term => term.trim()); // 确保去除空格
}

export async function extractTerms(text) {
  if (!text) return [];
  
  try {
    const response = await axios.post(
      'https://9060bf03b28847b787c356ac5dc037b0--8080.ap-shanghai2.cloudstudio.club/extract',
      { text },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10秒超时
      }
    );
    
    console.log('API原始响应:', response.data);
    const rawTerms = response.data.terms || [];
    const filteredTerms = filterTerms(rawTerms);
    console.log('过滤后术语:', filteredTerms);
    
    return filteredTerms;
    
  } catch (error) {
    console.error('术语提取错误:', error);
    message.error('NER错误: ' + error.message);
    return [];
  }
}

// 翻译文本函数 - 使用Google翻译API
export async function translateText(text, targetLang) {
  if (!text) return '';
  
  try {
    console.log('开始Google翻译:', { text: text.substring(0, 50) + '...', targetLang });
    
    // 使用Google翻译API的免费接口
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
      {
        timeout: 15000 // 15秒超时
      }
    );
    
    console.log('Google翻译API响应:', response.data);
    
    // 解析Google翻译API的响应格式
    if (response.data && response.data[0] && Array.isArray(response.data[0])) {
      const translatedText = response.data[0]
        .map(item => item[0])
        .filter(text => text)
        .join('');
      
      console.log('翻译结果:', translatedText);
      return translatedText;
    }
    
    return '';
    
  } catch (error) {
    console.error('Google翻译错误:', error);
    message.error('翻译错误: ' + error.message);
    
    // 限速重试机制
    if (error.response?.status === 429) {
      console.log('触发限速，1秒后重试...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const retryResponse = await axios.get(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
          {
            timeout: 15000
          }
        );
        
        if (retryResponse.data && retryResponse.data[0] && Array.isArray(retryResponse.data[0])) {
          return retryResponse.data[0]
            .map(item => item[0])
            .filter(text => text)
            .join('');
        }
        return '';
      } catch (retryError) {
        console.error('重试翻译失败:', retryError);
        return '';
      }
    }
    
    return '';
  }
}

// 获取Wikipedia摘要 - 增强版
export async function getWikiSummary(term) {
  if (!term) return { extract: '无效术语', url: '', thumbnail: null };
  
  try {
    console.log('正在获取Wikipedia摘要:', term);
    
    // 首先尝试英文Wikipedia
    let response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'CityU-AI-Knowledge-Weaver/1.0'
        }
      }
    );
    
    if (response.data && response.data.extract) {
      return {
        extract: response.data.extract,
        url: response.data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`,
        thumbnail: response.data.thumbnail?.source || null,
        title: response.data.title || term,
        lang: 'en'
      };
    }
    
    // 如果英文没找到，尝试中文Wikipedia
    console.log('英文Wikipedia未找到，尝试中文...');
    response = await axios.get(
      `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'CityU-AI-Knowledge-Weaver/1.0'
        }
      }
    );
    
    if (response.data && response.data.extract) {
      return {
        extract: response.data.extract,
        url: response.data.content_urls?.desktop?.page || `https://zh.wikipedia.org/wiki/${encodeURIComponent(term)}`,
        thumbnail: response.data.thumbnail?.source || null,
        title: response.data.title || term,
        lang: 'zh'
      };
    }
    
    return {
      extract: `未找到关于"${term}"的Wikipedia条目。这可能是一个专业术语或新概念。`,
      url: `https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(term)}`,
      thumbnail: null,
      title: term,
      lang: 'search'
    };
    
  } catch (error) {
    console.error('Wikipedia API错误:', error);
    
    if (error.response?.status === 404) {
      return {
        extract: `未找到关于"${term}"的Wikipedia条目。`,
        url: `https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(term)}`,
        thumbnail: null,
        title: term,
        lang: 'notfound'
      };
    }
    
    return {
      extract: `获取Wikipedia信息时出错: ${error.message}`,
      url: `https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(term)}`,
      thumbnail: null,
      title: term,
      lang: 'error'
    };
  }
}

// 搜索Wikipedia条目
export async function searchWikipedia(query, limit = 5) {
  try {
    console.log('搜索Wikipedia条目:', query);
    
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/search/${encodeURIComponent(query)}`,
      {
        params: { limit },
        timeout: 10000,
        headers: {
          'User-Agent': 'CityU-AI-Knowledge-Weaver/1.0'
        }
      }
    );
    
    return response.data.pages || [];
    
  } catch (error) {
    console.error('Wikipedia搜索错误:', error);
    return [];
  }
}