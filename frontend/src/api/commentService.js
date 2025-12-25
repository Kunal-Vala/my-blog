import axiosInstance from './axiosConfig'

export const commentService = {
  getCommentsByPost: async (postId) => {
    console.log('[commentService.getCommentsByPost] API call: GET /comment/post/' + postId);
    try {
      const response = await axiosInstance.get(`/comment/post/${postId}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch comments'
    }
  },

  createComment: async (commentData) => {
    console.log('[commentService.createComment] API call: POST /comment', commentData);
    try {
      const response = await axiosInstance.post('/comment', commentData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create comment'
    }
  },

  updateComment: async (id, commentData) => {
    console.log('[commentService.updateComment] API call: PUT /comment/' + id, commentData);
    try {
      const response = await axiosInstance.put(`/comment/${id}`, commentData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update comment'
    }
  },

  deleteComment: async (id) => {
    console.log('[commentService.deleteComment] API call: DELETE /comment/' + id);
    try {
      const response = await axiosInstance.delete(`/comment/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete comment'
    }
  },
}
