import { NextRequest, NextResponse } from 'next/server';
import * as Ably from 'ably';

export async function GET(_request: NextRequest) {
  const clientId = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
  
  // 環境変数からAblyのAPIキーを取得
  const apiKey = process.env.ABLY_API_KEY;
  
  // APIキーが設定されていない場合はエラーを返す
  if (!apiKey) {
    console.error('Ably API key not found in environment variables');
    return NextResponse.json(
      { error: 'Ably API key not configured. Please set the ABLY_API_KEY environment variable.' }, 
      { status: 500 }
    );
  }
  
  try {
    const client = new Ably.Rest(apiKey);
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: clientId,
    });
    
    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error('Error creating Ably token request:', error);
    return NextResponse.json(
      { error: 'Failed to create Ably token request' }, 
      { status: 500 }
    );
  }
}
