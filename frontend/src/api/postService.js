import axiosInstance from './axiosConfig'

export const postService = {
  getAllPosts: async () => {
    try {
      const response = await axiosInstance.get('/post/all')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch posts'
    }
  },

  getPostById: async (id) => {
    try {
      const response = await axiosInstance.get(`/post/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch post'
    }
  },

  createPost: async (postData) => {
    try {
      const response = await axiosInstance.post('/post', postData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create post'
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await axiosInstance.put(`/post/${id}`, postData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update post'
    }
  },

  deletePost: async (id) => {
    try {
      const response = await axiosInstance.delete(`/post/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete post'
    }
  },
}
