import { Body, fetch, ResponseType } from "@tauri-apps/api/http"
import { mytoken } from "../token"
import { Audio } from "./audio"

const API_URL = "https://api.vk.com/method"

interface Response<T> {
  response?: T
  error?: Error
}

interface IterableResponse<T> {
  count: number
  items: T[]
}

interface Error {
  error_code: number
  error_msg: string
}

interface User {
  id: number
  first_name: string
  last_name: string
  can_access_closed: boolean
  is_closed: boolean
}

export default class API {
  static async request<T>(method: string, data?: any): Promise<T> {
    const response = await fetch<Response<T>>(`${API_URL}/${method}`, {
      method: "POST",
      body: Body.form({
        v: "5.123",
        ...data,
      }),
      responseType: ResponseType.JSON,
    })

    if (!response.ok) {
      throw new Error(`${response.status} error`)
    }

    const responseData = response.data
    if (responseData.error) {
      throw new Error(responseData.error.error_msg)
    }

    if (!responseData.response) {
      throw new Error("No response")
    }

    return responseData.response
  }
}

export class AuthorizedAPI extends API {
  constructor(private token: string) {
    super()
  }

  async request<T>(method: string, data?: any): Promise<T> {
    return API.request<T>(method, {
      ...data,
      access_token: this.token
    })
  }

  async userGet(): Promise<any> {
    const response = await this.request<User[]>("users.get")
    return response
  }

  async audioSearch(query: string): Promise<Audio[]> {
    const response = await this.request<IterableResponse<Audio>>(
      "audio.search",
      { q: query }
    )

    return response.items
  }

  async audioGetById(audios: string[]): Promise<Audio[]> {
    const response = await this.request<Audio[]>("audio.getById", {
      audios: audios.join(","),
    })

    return response
  }

  async audioGet(user_id: number): Promise<Audio[]> {
    const response = await this.request<IterableResponse<Audio>>(
      "audio.get",
      { owner_id: user_id }
    )

    return response.items
  }

  async audioGetSelf(): Promise<Audio[]> {
    const response = await this.request<IterableResponse<Audio>>(
      "audio.get"
    )

    return response.items
  }

  async audioGetRecommendations(): Promise<Audio[]> {
    const response = await this.request<IterableResponse<Audio>>(
      "audio.getRecommendations"
    )

    return response.items
  }
}