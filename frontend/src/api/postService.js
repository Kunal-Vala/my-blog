import axiosInstance from './axiosConfig'

export const postService = {
  getAllPosts: async () => {
    console.log('[postService.getAllPosts] API call: GET /post/all');
    try {
      const response = await axiosInstance.get('/post/all')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch posts'
    }
  },

  getPostById: async (id) => {
    console.log('[postService.getPostById] API call: GET /post/' + id);
    try {
      const response = await axiosInstance.get(`/post/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch post'
    }
  },

  createPost: async (postData) => {
    console.log('[postService.createPost] API call: POST /post', postData);
    try {
      const response = await axiosInstance.post('/post', postData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create post'
    }
  },

  updatePost: async (id, postData) => {
    console.log('[postService.updatePost] API call: PUT /post/' + id, postData);
    try {
      const response = await axiosInstance.put(`/post/${id}`, postData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update post'
    }
  },

  deletePost: async (id) => {
    console.log('[postService.deletePost] API call: DELETE /post/' + id);
    try {
      const response = await axiosInstance.delete(`/post/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete post'
    }
  },
}
