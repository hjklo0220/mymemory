import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly baseUrl = process.env.OLLAMA_URL || 'http://ollama:11434';
  private readonly model = 'nomic-embed-text';

  async embed(text: string): Promise<number[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.model, prompt: text }),
      });
      if (!res.ok) {
        throw new Error(`Ollama error: ${res.status}`);
      }
      const data = await res.json();
      return data.embedding as number[];
    } catch (err) {
      this.logger.warn(`임베딩 생성 실패: ${err.message}`);
      return [];
    }
  }

  async isReady(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.models?.some((m: { name: string }) => m.name.startsWith('nomic-embed-text'));
    } catch {
      return false;
    }
  }
}
