'use client';

import { useEffect, useState } from 'react';
import { useChannel } from '@ably-labs/react-hooks';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Types } from 'ably';

export default function VoiceChat() {
  const [partner, setPartner] = useState<string | null>(null);
  const [waitingForPartner, setWaitingForPartner] = useState(false);
  const [messages, setMessages] = useState<{sender: string, audio: string}[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [myClientId, setMyClientId] = useState<string>('');
  const [roomChannel, setRoomChannel] = useState<Types.RealtimeChannelPromise | null>(null);
  const [error, setError] = useState<string | null>(null);

  // メディアレコーダーの設定
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    video: false,
    echoCancellation: true,
    noiseSuppression: true,
  });

  // ロビーチャンネル（マッチング用）
  const [lobbyChannel, lobbyPresence] = useChannel('nyan-lobby', (message) => {
    if (message.name === 'match-request' && message.data.partnerId === myClientId) {
      // マッチングリクエストを受け取った場合
      setPartner(message.data.clientId);
      setRoomId(message.data.roomId);
      setWaitingForPartner(false);
    }
  });

  // 初期化時にクライアントIDを設定
  useEffect(() => {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      setMyClientId(id);
    } catch (err) {
      setError('クライアントIDの生成に失敗しました');
      console.error('Error setting client ID:', err);
    }
  }, []);

  // ルームチャンネルの設定
  useEffect(() => {
    let channelCleanup: () => void = () => {};
    
    if (roomId) {
      try {
        // 外部でuseChannelを呼び出さないようにする
        const channelName = `nyan-room-${roomId}`;
        
        // AblyのSDKを直接使用してチャンネルを取得
        import('@ably-labs/react-hooks').then(({ getRealtimeInstance }) => {
          const ably = getRealtimeInstance();
          const channel = ably.channels.get(channelName);
          setRoomChannel(channel);
          
          // メッセージ受信時の処理
          const handleMessage = (message: any) => {
            if (message.data.sender !== myClientId) {
              setMessages(prev => [...prev, {
                sender: message.data.sender,
                audio: message.data.audio
              }]);
            }
          };
          
          channel.subscribe('voice-message', handleMessage);
          
          channelCleanup = () => {
            channel.unsubscribe('voice-message', handleMessage);
          };
        }).catch(err => {
          setError('Ablyチャンネルの初期化に失敗しました');
          console.error('Error initializing Ably channel:', err);
        });
      } catch (err) {
        setError('ルームチャンネルの設定に失敗しました');
        console.error('Error setting up room channel:', err);
      }
    }
    
    return channelCleanup;
  }, [roomId, myClientId]);

  // 録音完了時の処理
  useEffect(() => {
    if (mediaBlobUrl && roomChannel && partner) {
      try {
        // 音声メッセージを送信
        roomChannel.publish('voice-message', {
          sender: myClientId,
          audio: mediaBlobUrl
        });
        
        // 自分のメッセージも表示
        setMessages(prev => [...prev, {
          sender: myClientId,
          audio: mediaBlobUrl
        }]);
      } catch (err) {
        setError('音声メッセージの送信に失敗しました');
        console.error('Error sending voice message:', err);
      }
    }
  }, [mediaBlobUrl, roomChannel, partner, myClientId]);

  // ランダムマッチング開始
  const startRandomChat = () => {
    setWaitingForPartner(true);
    setError(null);
    
    try {
      // オンラインユーザーからランダムに選択
      const onlineUsers = lobbyPresence.presenceData.filter(user => user.clientId !== myClientId);
      
      if (onlineUsers.length > 0) {
        // ランダムにパートナーを選択
        const randomIndex = Math.floor(Math.random() * onlineUsers.length);
        const randomPartner = onlineUsers[randomIndex].clientId;
        
        // 新しいルームIDを生成
        const newRoomId = Math.random().toString(36).substring(2, 10);
        
        // マッチングリクエストを送信
        lobbyChannel.publish('match-request', {
          clientId: myClientId,
          partnerId: randomPartner,
          roomId: newRoomId
        });
        
        setPartner(randomPartner);
        setRoomId(newRoomId);
      } else {
        // パートナーが見つからない場合
        setTimeout(() => {
          if (waitingForPartner) {
            startRandomChat();
          }
        }, 3000);
      }
    } catch (err) {
      setError('ランダムマッチングの開始に失敗しました');
      setWaitingForPartner(false);
      console.error('Error starting random chat:', err);
    }
  };

  // チャットを終了
  const endChat = () => {
    setPartner(null);
    setRoomId(null);
    setMessages([]);
    clearBlobUrl();
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-purple-600">nyan</h1>
      
      {error && (
        <div className="w-full max-w-md mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          <p className="font-semibold">エラー:</p>
          <p>{error}</p>
        </div>
      )}
      
      {!partner && !waitingForPartner && (
        <button
          onClick={startRandomChat}
          className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          ランダムチャットを開始
        </button>
      )}
      
      {waitingForPartner && (
        <div className="text-center">
          <p className="mb-4">パートナーを探しています...</p>
          <button
            onClick={() => setWaitingForPartner(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded-full shadow-lg hover:bg-gray-500 transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}
      
      {partner && (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">チャット中</h2>
            <button
              onClick={endChat}
              className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              終了
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-80 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === myClientId ? 'bg-purple-100 ml-auto' : 'bg-gray-100'
                } max-w-[80%]`}
              >
                <audio src={msg.audio} controls className="w-full" />
              </div>
            ))}
          </div>
          
          <div className="flex items-center">
            {status !== 'recording' ? (
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
              >
                押しながら話す
              </button>
            ) : (
              <button
                className="w-full px-4 py-3 bg-red-500 text-white rounded-full shadow-lg animate-pulse"
              >
                録音中...
              </button>
            )}
          </div>
        </div>
      )}
      
      <p className="mt-8 text-sm text-gray-500">
        オンラインユーザー: {lobbyPresence.presenceData.length}
      </p>
    </div>
  );
}
