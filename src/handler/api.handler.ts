import axios from 'axios';
import { PAGE_ACCESS_TOKEN } from './credential.handler.ts';



class Api {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://graph.facebook.com/v21.0`;
  }



  // Fetch user info
  userInfo(id: string, callback: Function): Promise<any> {
    return axios.get(`${this.baseUrl}/${id}?fields=name`, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
      },
    }).then(response => {
      const data = response.data;

      // Ensure callback is a function before calling it
      if (typeof callback === 'function') {
        callback(data, null);
      } else {
        console.error('Provided callback is not a function');
      }
    })
      .catch(err => {
        callback(null, err);
        throw err;
      });
  }

  // Send a message
  sendMessage(message: { text?: string; attachment?: any }, senderId: string): Promise<any> {
    if (!message || (!message.text && !message.attachment)) {
      console.error('Provide valid text or attachment.');
      return Promise.reject('Invalid message format');
    }

    const payload = {
      recipient: { id: senderId },
      is_echo: false,
      message: {}
    };

    if (message.text) {
      payload.message.text = message.text;
    }

    if (message.attachment) {
      payload.message.attachment = message.attachment;
    }

    return axios.post(`${this.baseUrl}/me/messages`, payload, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
      },
    }).then(response => {
      return response.data;
    }).catch(error => {
      if (error.response) {
        console.error('Error response:', error.response.data.error);
      } else {
        console.error('Error sending message:', error.message);
      }
      return Promise.reject(error);
    });
  }

  // Fetch cool font
  async fetchFont(text: string): Promise<string> {
    try {
      const response = await axios.get(`https://joshweb.click/api/font?q=${encodeURIComponent(text)}`);
      return response.data[10]?.result || text; // Return the font or fallback to the original text
    } catch (error) {
      console.error('Error fetching font:', error);
      return text; // Return original text if there's an error
    }
  }

  // Send quick replies
  sendQuickReplies(text: string, senderId: string, quickRepliesConfig: Array<any>, callback: Function): Promise<any> {
    const payload = {
      recipient: { id: senderId },
      messaging_type: "RESPONSE",
      is_echo: false,
      message: {
        text: text,
        quick_replies: quickRepliesConfig // Using the passed config
      },
    };

    return axios.post(`${this.baseUrl}/me/messages`, payload, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
      },
    }).then(response => { callback(response.data, null) })
      .catch(error => { callback(null, error) })
  }
}

const api = new Api()


export default api;