import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const ImageEditor = ({ imageSrc, onSave, onClose }) => {
  const [currentImage, setCurrentImage] = useState(imageSrc)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [textOverlay, setTextOverlay] = useState('')
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 })
  const [textColor, setTextColor] = useState('#ffffff')
  const [textSize, setTextSize] = useState(24)
  const [textStyle, setTextStyle] = useState({ bold: false, italic: false })
  const [showTextInput, setShowTextInput] = useState(false)
  const [cropMode, setCropMode] = useState(false)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 })
  
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  // Emoji suggestions
  const emojiSuggestions = ['😊', '🎉', '❤️', '🔥', '⭐', '🌟', '💯', '🎯', '🏆', '✨', '💪', '🎨', '📸', '🎭', '🎪']

  // Update current image when imageSrc changes
  useEffect(() => {
    setCurrentImage(imageSrc)
  }, [imageSrc])

  const handleRotate = (direction) => {
    const newRotation = direction === 'left' ? rotation - 90 : rotation + 90
    setRotation(newRotation)
    drawImageOnCanvas(newRotation, scale)
  }

  const handleScale = (newScale) => {
    const finalScale = Math.max(0.1, Math.min(5, newScale))
    setScale(finalScale)
    drawImageOnCanvas(rotation, finalScale)
  }

  const handleAddText = () => {
    setShowTextInput(true)
  }

  const handleTextChange = (e) => {
    setTextOverlay(e.target.value)
    drawImageOnCanvas(rotation, scale, e.target.value)
  }

  const handleTextPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setTextPosition({ x, y })
    drawImageOnCanvas(rotation, scale, textOverlay, { x, y })
  }

  const addEmoji = (emoji) => {
    const newText = textOverlay + emoji
    setTextOverlay(newText)
    drawImageOnCanvas(rotation, scale, newText)
  }

  const toggleTextStyle = (style) => {
    const newStyle = { ...textStyle, [style]: !textStyle[style] }
    setTextStyle(newStyle)
    drawImageOnCanvas(rotation, scale, textOverlay)
  }

  const drawImageOnCanvas = (rot = rotation, scl = scale, text = textOverlay, pos = textPosition) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imageRef.current
    
    if (!canvas || !ctx || !img) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw image with transformations
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rot * Math.PI) / 180)
    ctx.scale(scl, scl)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
    ctx.restore()
    
    // Add text overlay
    if (text) {
      let fontStyle = ''
      if (textStyle.italic) fontStyle += 'italic '
      if (textStyle.bold) fontStyle += 'bold '
      
      ctx.font = `${fontStyle}${textSize}px Arial`
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      
      ctx.fillText(
        text,
        (pos.x / 100) * canvas.width,
        (pos.y / 100) * canvas.height
      )
      
      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const editedImageData = canvas.toDataURL('image/png')
    onSave(editedImageData)
  }

  const handleImageLoad = () => {
    const canvas = canvasRef.current
    const img = imageRef.current
    
    if (!canvas || !img) return
    
    // Set canvas size to image size
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    
    // Draw image initially
    drawImageOnCanvas()
  }

  const resetTransformations = () => {
    setRotation(0)
    setScale(1)
    setTextOverlay('')
    setTextStyle({ bold: false, italic: false })
    setShowTextInput(false)
    drawImageOnCanvas(0, 1, '')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Image</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Image Preview */}
            <div className="lg:col-span-3">
              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border rounded cursor-crosshair"
                  onClick={handleTextPosition}
                />
                <img
                  ref={imageRef}
                  src={currentImage}
                  alt="Edit"
                  className="hidden"
                  onLoad={handleImageLoad}
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Transform Controls */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Transform</h3>
                
                {/* Rotation */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rotation</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRotate('left')}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ↶
                    </button>
                    <span className="px-3 py-1 bg-gray-200 rounded min-w-[60px] text-center">
                      {rotation}°
                    </span>
                    <button
                      onClick={() => handleRotate('right')}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ↷
                    </button>
                  </div>
                </div>

                {/* Scale */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Scale: {scale.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={scale}
                    onChange={(e) => handleScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.1x</span>
                    <span>1x</span>
                    <span>5x</span>
                  </div>
                </div>

                {/* Quick Scale Buttons */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Quick Scale</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleScale(0.5)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                    >
                      0.5x
                    </button>
                    <button
                      onClick={() => handleScale(1)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                    >
                      1x
                    </button>
                    <button
                      onClick={() => handleScale(2)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                    >
                      2x
                    </button>
                  </div>
                </div>

                <button
                  onClick={resetTransformations}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Reset All
                </button>
              </div>

              {/* Text Overlay */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Text Overlay</h3>
                
                <button
                  onClick={handleAddText}
                  className="w-full mb-3 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Text
                </button>

                {showTextInput && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter text..."
                      value={textOverlay}
                      onChange={handleTextChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                    
                    {/* Text Style Controls */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleTextStyle('bold')}
                        className={`px-3 py-1 rounded text-sm ${textStyle.bold ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        onClick={() => toggleTextStyle('italic')}
                        className={`px-3 py-1 rounded text-sm ${textStyle.italic ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                      >
                        <em>I</em>
                      </button>
                    </div>

                    {/* Emoji Suggestions */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Add Emoji</label>
                      <div className="grid grid-cols-5 gap-1">
                        {emojiSuggestions.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => addEmoji(emoji)}
                            className="p-1 text-lg hover:bg-gray-200 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Text Color</label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value)
                          drawImageOnCanvas(rotation, scale, textOverlay)
                        }}
                        className="w-full h-10 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Text Size: {textSize}px</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={textSize}
                        onChange={(e) => {
                          setTextSize(parseInt(e.target.value))
                          drawImageOnCanvas(rotation, scale, textOverlay)
                        }}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>12px</span>
                        <span>72px</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600">
                      Click on the image to position the text
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImageEditor 