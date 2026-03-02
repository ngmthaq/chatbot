/**
 * Audio Gateway - WebSocket handler for real-time audio streaming
 *
 * NOTE: This is an OPTIONAL feature. Audio processing is primarily handled CLIENT-SIDE
 * using Chrome's Web Speech API (speechRecognition and speechSynthesis).
 *
 * This WebSocket gateway provides fallback server-side audio processing for:
 * - Browsers without Web Speech API support
 * - Applications requiring server-side audio processing
 * - Advanced features like multi-language support, custom voices, etc.
 *
 * Namespace: /audio
 * Events:
 * - audio:chunk - Client sends audio data for transcription
 * - audio:transcription - Server returns transcribed text
 * - audio:textToSpeech - Client requests audio from text
 * - audio:audioResponse - Server returns synthesized audio
 * - audio:error - Error notifications
 */
import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthGuard } from '../auth/auth.guard';

import { AudioService } from './audio.service';
import { SpeechToTextService } from './speech-to-text.service';
import { TextToSpeechService } from './text-to-speech.service';

interface AudioChunkData {
  audio: string; // Base64 encoded audio
  format?: string; // Audio format (e.g., 'wav', 'mp3')
  conversationId: number;
}

interface TextToAudioData {
  text: string;
  conversationId: number;
  voiceId?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/audio',
})
export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AudioGateway.name);
  private activeConnections = new Map<string, number>();

  constructor(
    private readonly audioService: AudioService,
    private readonly speechToTextService: SpeechToTextService,
    private readonly textToSpeechService: TextToSpeechService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.activeConnections.set(client.id, Date.now());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeConnections.delete(client.id);
  }

  /**
   * Handle incoming audio chunks for speech-to-text
   */
  @SubscribeMessage('audio:chunk')
  @UseGuards(AuthGuard)
  async handleAudioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AudioChunkData,
  ) {
    this.logger.debug(
      `Received audio chunk from client ${client.id} for conversation ${data.conversationId}`,
    );

    try {
      // Decode base64 audio
      const audioBuffer = Buffer.from(data.audio, 'base64');

      // Process audio with speech-to-text
      const transcription = await this.speechToTextService.transcribe(
        audioBuffer,
        data.format || 'wav',
      );

      // Send transcription back to client
      client.emit('audio:transcription', {
        text: transcription,
        conversationId: data.conversationId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error processing audio chunk: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      client.emit('audio:error', {
        message: 'Failed to process audio',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return { success: false, error: 'Failed to process audio' };
    }
  }

  /**
   * Handle text-to-speech requests
   */
  @SubscribeMessage('audio:synthesize')
  @UseGuards(AuthGuard)
  async handleTextToSpeech(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: TextToAudioData,
  ) {
    this.logger.debug(
      `Synthesizing speech for client ${client.id} in conversation ${data.conversationId}`,
    );

    try {
      // Generate audio from text
      const audioBuffer = await this.textToSpeechService.synthesize(
        data.text,
        data.voiceId,
      );

      // Send audio back to client as base64
      client.emit('audio:response', {
        audio: audioBuffer.toString('base64'),
        conversationId: data.conversationId,
        format: 'wav',
      });

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error synthesizing speech: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      client.emit('audio:error', {
        message: 'Failed to synthesize speech',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return { success: false, error: 'Failed to synthesize speech' };
    }
  }

  /**
   * Get active connections count
   */
  getActiveConnections(): number {
    return this.activeConnections.size;
  }
}
