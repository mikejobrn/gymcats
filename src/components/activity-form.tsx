'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const activitySchema = z.object({
  type: z.enum(['WATER', 'RESISTANCE', 'CARDIO']),
  value: z.number().min(0.1, 'Valor deve ser maior que 0')
})

type ActivityFormData = z.infer<typeof activitySchema>

interface ActivityFormProps {
  onActivityAdded: () => void
}

export function ActivityForm({ onActivityAdded }: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedType, setSelectedType] = useState<'WATER' | 'RESISTANCE' | 'CARDIO'>('WATER')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: 'WATER'
    }
  })

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        reset()
        onActivityAdded()
      }
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const activities = [
    { type: 'WATER' as const, label: '💧 Água', unit: 'L', placeholder: '0.5' },
    { type: 'RESISTANCE' as const, label: '💪 Resistência', unit: 'min', placeholder: '30' },
    { type: 'CARDIO' as const, label: '🏃 Cardio', unit: 'min', placeholder: '20' }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-dark mb-6">
        Registrar Atividade
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Activity Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-dark mb-3">
            Tipo de Atividade
          </label>
          <div className="grid grid-cols-3 gap-3">
            {activities.map((activity) => (
              <button
                key={activity.type}
                type="button"
                onClick={() => setSelectedType(activity.type)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === activity.type
                    ? 'border-pink-burnt bg-pink-pastel text-pink-burnt'
                    : 'border-gray-dark hover:border-pink-medium'
                }`}
              >
                <div className="text-2xl mb-2">{activity.label.split(' ')[0]}</div>
                <div className="text-sm font-medium">{activity.label.split(' ')[1]}</div>
              </button>
            ))}
          </div>
          <input 
            type="hidden" 
            {...register('type')} 
            value={selectedType}
          />
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-dark mb-2">
            Quantidade ({activities.find(a => a.type === selectedType)?.unit})
          </label>
          <input
            type="number"
            step="0.1"
            placeholder={activities.find(a => a.type === selectedType)?.placeholder}
            {...register('value', { valueAsNumber: true })}
            className="w-full p-3 border border-gray-dark rounded-xl focus:ring-2 focus:ring-pink-burnt focus:border-transparent text-gray-dark"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-burnt text-white py-3 px-6 rounded-xl hover:bg-pink-hot transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Atividade'}
        </button>
      </form>
    </div>
  )
}
