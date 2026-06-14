import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-openai-key',
})

export async function embedText(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      input: text,
      model: 'text-embedding-3-small',
    })
    return response.data[0].embedding
  } catch (error) {
    console.error('Error embedding text:', error)
    throw error
  }
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      input: texts,
      model: 'text-embedding-3-small',
    })

    return response.data.map(item => item.embedding)
  } catch (error) {
    console.error('Error embedding batch:', error)
    throw error
  }
}
