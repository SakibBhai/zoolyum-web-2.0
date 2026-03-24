"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Save, Loader2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Statistic {
  id?: string
  label: string
  value: string
  suffix: string
  order: number
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistic[]>([
    { label: "Years Experience", value: "50", suffix: "+", order: 1 },
    { label: "Projects Completed", value: "30", suffix: "+", order: 2 },
    { label: "Happy Clients", value: "5", suffix: "+", order: 3 },
    { label: "Industry Awards", value: "5", suffix: "", order: 4 }
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch statistics on load
  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/homepage/statistics')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setStatistics(data)
        }
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
      toast.error('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const addStatistic = () => {
    setStatistics([
      ...statistics,
      {
        label: "",
        value: "0",
        suffix: "+",
        order: statistics.length + 1
      }
    ])
  }

  const removeStatistic = (index: number) => {
    if (statistics.length <= 1) {
      toast.error('You must have at least one statistic')
      return
    }
    setStatistics(statistics.filter((_, i) => i !== index))
  }

  const updateStatistic = (index: number, field: keyof Statistic, value: string | number) => {
    const newStats = [...statistics]
    newStats[index] = { ...newStats[index], [field]: value }
    setStatistics(newStats)
  }

  const saveStatistics = async () => {
    // Validation
    const isValid = statistics.every(stat => stat.label.trim() !== "" && stat.value.trim() !== "")
    if (!isValid) {
      toast.error('Please fill in all label and value fields')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/homepage/statistics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statistics })
      })

      if (response.ok) {
        toast.success('Statistics saved successfully!')
      } else {
        toast.error('Failed to save statistics')
      }
    } catch (error) {
      console.error('Error saving statistics:', error)
      toast.error('Error saving statistics')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaults = () => {
    setStatistics([
      { label: "Years Experience", value: "50", suffix: "+", order: 1 },
      { label: "Projects Completed", value: "30", suffix: "+", order: 2 },
      { label: "Happy Clients", value: "5", suffix: "+", order: 3 },
      { label: "Industry Awards", value: "5", suffix: "", order: 4 }
    ])
    toast.info('Reset to default values')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5001]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[#FF5001]" />
              Statistics Configuration
            </h1>
            <p className="text-[#E9E7E2]/70 mt-2">
              Manage the statistics displayed on your homepage and about page
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="border-[#333333] text-[#E9E7E2] hover:bg-[#1A1A1A]"
            >
              Reset Defaults
            </Button>
            <Button
              onClick={saveStatistics}
              disabled={saving}
              className="bg-[#FF5001] hover:bg-[#FF5001]/90 text-white min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview Card */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              This is how your statistics will appear on the website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-[#0A0A0A] rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold text-[#FF5001]">
                    {stat.value}{stat.suffix}
                  </div>
                  <p className="text-sm mt-2 text-[#E9E7E2]/80">{stat.label || "Untitled"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Editor */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit Statistics</CardTitle>
                <CardDescription>
                  Customize the label, value, and suffix for each statistic
                </CardDescription>
              </div>
              <Button
                onClick={addStatistic}
                variant="outline"
                size="sm"
                className="border-[#FF5001] text-[#FF5001] hover:bg-[#FF5001]/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Statistic
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-[#0A0A0A] rounded-lg border border-[#333333] hover:border-[#FF5001]/50 transition-colors"
                >
                  {/* Label */}
                  <div className="md:col-span-2">
                    <Label className="text-[#E9E7E2] mb-2 block">
                      Label <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStatistic(index, 'label', e.target.value)}
                      placeholder="e.g., Years Experience"
                      className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] focus:border-[#FF5001]"
                    />
                  </div>

                  {/* Value */}
                  <div>
                    <Label className="text-[#E9E7E2] mb-2 block">
                      Value <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                      placeholder="50"
                      className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] focus:border-[#FF5001]"
                    />
                  </div>

                  {/* Suffix */}
                  <div>
                    <Label className="text-[#E9E7E2] mb-2 block">Suffix</Label>
                    <Input
                      value={stat.suffix}
                      onChange={(e) => updateStatistic(index, 'suffix', e.target.value)}
                      placeholder="+"
                      maxLength={5}
                      className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] focus:border-[#FF5001]"
                    />
                  </div>

                  {/* Order & Delete */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-[#E9E7E2] mb-2 block">Order</Label>
                      <Input
                        type="number"
                        value={stat.order}
                        onChange={(e) => updateStatistic(index, 'order', parseInt(e.target.value) || 0)}
                        className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] focus:border-[#FF5001]"
                      />
                    </div>
                    <Button
                      onClick={() => removeStatistic(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {statistics.length === 0 && (
                <div className="text-center py-12 text-[#E9E7E2]/50">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No statistics yet. Click "Add Statistic" to create one.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-[#FF5001]/5 border-[#FF5001]/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#FF5001]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#FF5001]" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#E9E7E2] mb-1">Pro Tips</h4>
                <ul className="text-sm text-[#E9E7E2]/70 space-y-1">
                  <li>• Use short, clear labels (e.g., "Years Experience" not "The number of years we have been in business")</li>
                  <li>• Common suffixes: +, %, k, M, B</li>
                  <li>• Keep values under 1000 for better visual impact</li>
                  <li>• Order field determines display sequence (lower numbers first)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
