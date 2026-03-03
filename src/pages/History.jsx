import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFormat, setSelectedFormat] = useState('png')
  const [selectedResolution, setSelectedResolution] = useState('original')
  const [downloadingId, setDownloadingId] = useState(null)
  
  const { backendUrl, token } = useContext(AppContext)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/image/history', { 
        headers: { token } 
      })
      if (data.success) {
        setHistory(data.history)
      }
    } catch (error) {
      toast.error('Failed to load history')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (historyItem) => {
    try {
      setDownloadingId(historyItem.id)
      const { data } = await axios.post(backendUrl + '/api/image/download-image', {
        historyId: historyItem.id,
        format: selectedFormat,
        resolution: selectedResolution
      }, { headers: { token } })

      if (data.success) {
        // Create download link
        const link = document.createElement('a')
        link.href = data.imageData
        link.download = `imagify-${historyItem.id}.${selectedFormat}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Image downloaded successfully')
      }
    } catch (error) {
      toast.error('Failed to download image')
      console.log(error)
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDelete = async (historyId) => {
    if (!window.confirm('Are you sure you want to delete this image from history?')) {
      return
    }

    try {
      const { data } = await axios.delete(backendUrl + `/api/image/history/${historyId}`, { 
        headers: { token } 
      })
      if (data.success) {
        toast.success('Image deleted from history')
        loadHistory()
      }
    } catch (error) {
      toast.error('Failed to delete image')
      console.log(error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your history...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-[80vh] pt-14 mb-10"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium mb-2">Your Image History</h1>
        <p className="text-gray-600">View and manage your generated images</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-medium mb-2">No images yet</h3>
          <p className="text-gray-600">Start generating images to see them here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Download Settings */}
          <div className="bg-white p-4 rounded-lg border max-w-md mx-auto">
            <h3 className="font-medium mb-3">Download Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Resolution</label>
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="original">Original</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4k">4K</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative group">
                  <img
                    src={item.imageData}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <button
                        onClick={() => handleDownload(item)}
                        disabled={downloadingId === item.id}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                      >
                        {downloadingId === item.id ? 'Downloading...' : 'Download'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.prompt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{formatDate(item.createdAt)}</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {item.format}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {item.resolution}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default History 