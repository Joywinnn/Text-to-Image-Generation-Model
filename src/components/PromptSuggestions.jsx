import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'

const PromptSuggestions = ({ onPromptSelect, currentPrompt }) => {
  const [suggestions, setSuggestions] = useState([])
  const [userTemplates, setUserTemplates] = useState([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [newTemplate, setNewTemplate] = useState({ name: '', prompt: '' })
  const [showSaveForm, setShowSaveForm] = useState(false)
  
  const { backendUrl, token } = useContext(AppContext)

  useEffect(() => {
    loadSuggestions()
    loadUserTemplates()
  }, [])

  const loadSuggestions = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/prompt/suggestions')
      if (data.success) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadUserTemplates = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/prompt/templates', { 
        headers: { token } 
      })
      if (data.success) {
        setUserTemplates(data.templates)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.prompt) {
      toast.error('Please fill in both name and prompt')
      return
    }

    try {
      const { data } = await axios.post(backendUrl + '/api/prompt/templates', 
        newTemplate, 
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Template saved successfully')
        setNewTemplate({ name: '', prompt: '' })
        setShowSaveForm(false)
        loadUserTemplates()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleToggleFavorite = async (templateId) => {
    try {
      const { data } = await axios.put(backendUrl + `/api/prompt/templates/${templateId}/favorite`, 
        {}, 
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        loadUserTemplates()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    try {
      const { data } = await axios.delete(backendUrl + `/api/prompt/templates/${templateId}`, 
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Template deleted successfully')
        loadUserTemplates()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Prompt Suggestions</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200"
          >
            {showTemplates ? 'Show Suggestions' : 'My Templates'}
          </button>
          {currentPrompt && (
            <button
              onClick={() => setShowSaveForm(true)}
              className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full hover:bg-green-200"
            >
              Save Current
            </button>
          )}
        </div>
      </div>

      {/* Save Template Form */}
      {showSaveForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border mb-4"
        >
          <h4 className="font-medium mb-3">Save Current Prompt as Template</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Template name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
            <textarea
              placeholder="Prompt"
              value={newTemplate.prompt}
              onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
              className="w-full px-3 py-2 border rounded-md h-20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveTemplate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Template
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Templates */}
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {userTemplates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No saved templates yet</p>
          ) : (
            userTemplates.map((template) => (
              <div key={template.id} className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{template.name}</h4>
                      {template.isFavorite && (
                        <span className="text-yellow-500">⭐</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{template.prompt}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onPromptSelect(template.prompt)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => handleToggleFavorite(template.id)}
                        className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded hover:bg-yellow-200"
                      >
                        {template.isFavorite ? 'Unfavorite' : 'Favorite'}
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Curated Suggestions */}
      {!showTemplates && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPromptSelect(suggestion.prompt)}
            >
              <h4 className="font-medium text-gray-800 mb-1">{suggestion.name}</h4>
              <p className="text-sm text-gray-600">{suggestion.prompt}</p>
              <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {suggestion.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default PromptSuggestions 