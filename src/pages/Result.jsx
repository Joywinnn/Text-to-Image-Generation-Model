import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import PromptSuggestions from '../components/PromptSuggestions'
import ImageEditor from '../components/ImageEditor'
import { toast } from 'react-toastify'
import axios from 'axios'

const Result = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [image, setImage] = useState(assets.sample_img_1)
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState('png')
  const [selectedResolution, setSelectedResolution] = useState('original')
  const [showEditor, setShowEditor] = useState(false)
  const [editedImage, setEditedImage] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const { generateImage, backendUrl, token } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (input) {
      const result = await generateImage(input, selectedFormat, selectedResolution)
      if (result && result.image) {
        setIsImageLoaded(true)
        setImage(result.image)
        setCurrentHistoryId(result.historyId)
        setEditedImage(null)
      }
    }
    setLoading(false)
  }

  const handlePromptSelect = (prompt) => {
    setInput(prompt)
  }

  const handleDownload = async () => {
    // If we have an edited image, download it directly
    if (editedImage) {
      const link = document.createElement('a')
      link.href = editedImage
      link.download = `imagify-edited-${Date.now()}.${selectedFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Edited image downloaded successfully')
      return
    }

    // If no edited image but we have a history ID, use backend processing
    if (currentHistoryId) {
      try {
        setDownloading(true)
        const { data } = await axios.post(backendUrl + '/api/image/download-image', {
          historyId: currentHistoryId,
          format: selectedFormat,
          resolution: selectedResolution
        }, { headers: { token } })

        if (data.success) {
          const link = document.createElement('a')
          link.href = data.imageData
          link.download = `imagify-${currentHistoryId}.${selectedFormat}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          toast.success('Image downloaded successfully')
        }
      } catch (error) {
        toast.error('Failed to download image')
        console.log(error)
      } finally {
        setDownloading(false)
      }
    } else {
      // Fallback to direct download of original image
      const link = document.createElement('a')
      link.href = image
      link.download = `imagify-${Date.now()}.${selectedFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Image downloaded successfully')
    }
  }

  const handleEditSave = (editedImageData) => {
    setEditedImage(editedImageData)
    setShowEditor(false)
    toast.success('Image edited successfully')
  }

  const resetToOriginal = () => {
    setEditedImage(null)
    toast.info('Reset to original image')
  }

  return (
    <>
      <motion.div className='flex flex-col min-h-[90vh] justify-center items-center'
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <div className='relative'>
            <img className='max-w-sm rounded shadow-lg' src={editedImage || image} alt="" />
            <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
          </div>
          <p className={!loading ? 'hidden' : 'text-center mt-2 text-gray-600'}>Generating your image...</p>
        </div>

        {!isImageLoaded && (
          <div className='w-full max-w-xl mt-10'>
            <form onSubmit={onSubmitHandler}>
              <div className='flex w-full bg-neutral-500 text-white text-sm p-0.5 rounded-full'>
                <input 
                  onChange={e => setInput(e.target.value)} 
                  value={input} 
                  className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 grey-placeholder' 
                  type="text" 
                  placeholder='Describe what you want to generate' 
                />
                <button type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
              </div>
            </form>
            
            {/* Prompt Suggestions */}
            <PromptSuggestions onPromptSelect={handlePromptSelect} currentPrompt={input} />
          </div>
        )}

        {isImageLoaded && (
          <div className='w-full max-w-xl mt-10 space-y-4'>
            {/* Download Settings */}
            <div className='bg-white p-4 rounded-lg border'>
              <h3 className='font-medium mb-3 text-center'>Download Settings</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Format</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className='w-full px-3 py-2 border rounded-md'
                  >
                    <option value="png">PNG (Best Quality)</option>
                    <option value="jpg">JPG (Smaller Size)</option>
                    <option value="webp">WebP (Modern Format)</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Resolution</label>
                  <select
                    value={selectedResolution}
                    onChange={(e) => setSelectedResolution(e.target.value)}
                    className='w-full px-3 py-2 border rounded-md'
                  >
                    <option value="original">Original</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4k">4K</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 flex-wrap justify-center'>
              <button 
                type="button"
                onClick={() => { setIsImageLoaded(false) }} 
                className='bg-transparent border border-zinc-900 text-black px-6 py-3 rounded-full cursor-pointer hover:bg-gray-50'
              >
                Generate Another
              </button>
              
              <button 
                type="button"
                onClick={() => setShowEditor(true)}
                className='bg-purple-600 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-purple-700'
              >
                Edit Image
              </button>
              
              {editedImage && (
                <button 
                  type="button"
                  onClick={resetToOriginal}
                  className='bg-gray-500 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-gray-600'
                >
                  Reset
                </button>
              )}
              
              <button 
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className='bg-zinc-900 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-zinc-800 disabled:opacity-50'
              >
                {downloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Image Editor Modal */}
      {showEditor && (
        <ImageEditor
          imageSrc={editedImage || image}
          onSave={handleEditSave}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  )
}

export default Result