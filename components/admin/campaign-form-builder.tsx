"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Circle,
  ChevronDown,
  FileText,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "radio" | "date" | "number";
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

interface CampaignFormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
  className?: string;
}

const FIELD_TYPES = [
  { value: "text", label: "Text Input", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "tel", label: "Phone", icon: Phone },
  { value: "textarea", label: "Textarea", icon: FileText },
  { value: "select", label: "Dropdown", icon: ChevronDown },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
  { value: "radio", label: "Radio Button", icon: Circle },
  { value: "date", label: "Date Picker", icon: Calendar },
  { value: "number", label: "Number", icon: Hash },
];

export function CampaignFormBuilder({
  fields,
  onChange,
  className,
}: CampaignFormBuilderProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const addField = useCallback(
    (type: FormField["type"]) => {
      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `field_${fields.length + 1}`,
        label: `New ${type} Field`,
        type,
        required: false,
        placeholder: "",
        description: "",
        options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1"] : undefined,
      };
      onChange([...fields, newField]);
      setSelectedField(newField.id);
    },
    [fields, onChange]
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      const updatedFields = fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
      onChange(updatedFields);
    },
    [fields, onChange]
  );

  const removeField = useCallback(
    (fieldId: string) => {
      const updatedFields = fields.filter((field) => field.id !== fieldId);
      onChange(updatedFields);
      if (selectedField === fieldId) {
        setSelectedField(null);
      }
    },
    [fields, onChange, selectedField]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const reorderedFields = Array.from(fields);
      const [removed] = reorderedFields.splice(result.source.index, 1);
      reorderedFields.splice(result.destination.index, 0, removed);

      onChange(reorderedFields);
    },
    [fields, onChange]
  );

  const addOption = useCallback(
    (fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (field && field.options) {
        const newOptions = [...field.options, `Option ${field.options.length + 1}`];
        updateField(fieldId, { options: newOptions });
      }
    },
    [fields, updateField]
  );

  const updateOption = useCallback(
    (fieldId: string, optionIndex: number, value: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (field && field.options) {
        const newOptions = [...field.options];
        newOptions[optionIndex] = value;
        updateField(fieldId, { options: newOptions });
      }
    },
    [fields, updateField]
  );

  const removeOption = useCallback(
    (fieldId: string, optionIndex: number) => {
      const field = fields.find((f) => f.id === fieldId);
      if (field && field.options && field.options.length > 1) {
        const newOptions = field.options.filter((_, index) => index !== optionIndex);
        updateField(fieldId, { options: newOptions });
      }
    },
    [fields, updateField]
  );

  const renderFieldPreview = (field: FormField) => {
    const baseProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder,
      required: field.required,
      className: "bg-[#252525] border-[#333333] text-[#E9E7E2]",
    };

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return <Input {...baseProps} type={field.type} />;
      case "textarea":
        return <Textarea {...baseProps} rows={3} />;
      case "date":
        return <Input {...baseProps} type="date" />;
      case "select":
        return (
          <Select>
            <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E9E7E2]">
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, "_")}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${field.name}_${index}`}
                  className="rounded border-[#333333]"
                />
                <Label htmlFor={`${field.name}_${index}`} className="text-[#E9E7E2]">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}_${index}`}
                  name={field.name}
                  className="border-[#333333]"
                />
                <Label htmlFor={`${field.name}_${index}`} className="text-[#E9E7E2]">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      default:
        return <Input {...baseProps} />;
    }
  };

  const selectedFieldData = fields.find((f) => f.id === selectedField);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#E9E7E2]">Form Builder</h3>
          <p className="text-sm text-[#E9E7E2]/60">
            Drag and drop to reorder fields, click to edit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {previewMode ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Types Panel */}
        {!previewMode && (
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2] text-sm">Add Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {FIELD_TYPES.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <Button
                    key={fieldType.value}
                    type="button"
                    variant="ghost"
                    className="w-full justify-start text-[#E9E7E2] hover:bg-[#252525]"
                    onClick={() => addField(fieldType.value as FormField["type"])}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {fieldType.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Form Fields */}
        <Card className={cn("bg-[#1A1A1A] border-[#333333]", previewMode ? "lg:col-span-3" : "lg:col-span-1")}>>
          <CardHeader>
            <CardTitle className="text-[#E9E7E2] text-sm">
              {previewMode ? "Form Preview" : "Form Fields"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previewMode ? (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label className="text-[#E9E7E2]">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.description && (
                      <p className="text-sm text-[#E9E7E2]/60">{field.description}</p>
                    )}
                    {renderFieldPreview(field)}
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-[#E9E7E2]/60 text-center py-8">
                    No fields added yet. Switch to edit mode to add fields.
                  </p>
                )}
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center gap-2 p-3 bg-[#252525] border border-[#333333] rounded-lg cursor-pointer transition-colors",
                                selectedField === field.id && "border-[#FF5001]",
                                snapshot.isDragging && "opacity-50"
                              )}
                              onClick={() => setSelectedField(field.id)}
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-[#E9E7E2]/60" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#E9E7E2] font-medium">{field.label}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {field.type}
                                  </Badge>
                                  {field.required && (
                                    <Badge variant="destructive" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                {field.description && (
                                  <p className="text-sm text-[#E9E7E2]/60 mt-1">
                                    {field.description}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {fields.length === 0 && (
                        <p className="text-[#E9E7E2]/60 text-center py-8">
                          No fields added yet. Click on field types to add them.
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>

        {/* Field Editor */}
        {!previewMode && selectedFieldData && (
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2] text-sm">Edit Field</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#E9E7E2]">Field Name</Label>
                <Input
                  value={selectedFieldData.name}
                  onChange={(e) => updateField(selectedField!, { name: e.target.value })}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label className="text-[#E9E7E2]">Label</Label>
                <Input
                  value={selectedFieldData.label}
                  onChange={(e) => updateField(selectedField!, { label: e.target.value })}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label className="text-[#E9E7E2]">Placeholder</Label>
                <Input
                  value={selectedFieldData.placeholder || ""}
                  onChange={(e) => updateField(selectedField!, { placeholder: e.target.value })}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>

              <div>
                <Label className="text-[#E9E7E2]">Description</Label>
                <Textarea
                  value={selectedFieldData.description || ""}
                  onChange={(e) => updateField(selectedField!, { description: e.target.value })}
                  className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedFieldData.required}
                  onCheckedChange={(checked) => updateField(selectedField!, { required: checked })}
                />
                <Label className="text-[#E9E7E2]">Required Field</Label>
              </div>

              {(selectedFieldData.type === "select" ||
                selectedFieldData.type === "radio" ||
                selectedFieldData.type === "checkbox") && (
                <div>
                  <Label className="text-[#E9E7E2]">Options</Label>
                  <div className="space-y-2">
                    {selectedFieldData.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(selectedField!, index, e.target.value)}
                          className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(selectedField!, index)}
                          disabled={selectedFieldData.options!.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(selectedField!)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}