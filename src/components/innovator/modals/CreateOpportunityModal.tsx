import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/innovator/ui/dialog";
import { Button } from "@/components/innovator/ui/button";
import { Input } from "@/components/innovator/ui/input";
import { Textarea } from "@/components/innovator/ui/textarea";
import { Label } from "@/components/innovator/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/innovator/ui/select";
import { Badge } from "@/components/innovator/ui/badge";
import { opportunitiesAPI } from "@/lib/innovator/fishtankApiExtended";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

const opportunitySchema = z.object({
  role: z.string().min(1, "Role title is required"),
  description: z.string().min(40, "Description must be at least 40 characters"),
  deliverables: z.array(z.string()).min(1, "At least one deliverable is required"),
  hoursPerWeek: z.number().min(1, "Hours per week is required"),
  durationWeeks: z.number().min(1, "Duration is required"),
  startDate: z.string().min(1, "Start date is required"),
  compensationType: z.enum(['paid', 'equity', 'stipend', 'volunteer']),
  compensationRange: z.string().optional(),
  location: z.enum(['remote', 'local']),
  tags: z.array(z.string()).min(1, "At least one tag is required")
});

interface CreateOpportunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateOpportunityModal = ({ open, onOpenChange, onSuccess }: CreateOpportunityModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const form = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      role: '',
      description: '',
      deliverables: [''],
      hoursPerWeek: 20,
      durationWeeks: 12,
      startDate: '',
      compensationType: 'paid' as const,
      compensationRange: '',
      location: 'remote' as const,
      tags: []
    }
  });

  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const updateDeliverable = (index: number, value: string) => {
    const updated = [...deliverables];
    updated[index] = value;
    setDeliverables(updated);
    form.setValue('deliverables', updated.filter(d => d.trim()));
  };

  const removeDeliverable = (index: number) => {
    const updated = deliverables.filter((_, i) => i !== index);
    setDeliverables(updated);
    form.setValue('deliverables', updated.filter(d => d.trim()));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue('tags', updatedTags as any);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue('tags', updatedTags as any);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await opportunitiesAPI.postOpportunity({
        ...data,
        commitment: {
          hoursPerWeek: data.hoursPerWeek,
          durationWeeks: data.durationWeeks,
          startDate: data.startDate
        },
        compensation: {
          type: data.compensationType,
          range: data.compensationRange
        },
        deliverables: deliverables.filter(d => d.trim())
      });
      
      toast.success("Opportunity posted successfully!");
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      form.reset();
      setDeliverables(['']);
      setTags([]);
    } catch (error) {
      toast.error("Failed to post opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Opportunity</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Title */}
          <div>
            <Label htmlFor="role">Role Title *</Label>
            <Input
              id="role"
              placeholder="e.g. Senior React Developer"
              {...form.register("role")}
            />
            {form.formState.errors.role && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="min-h-[100px]"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Deliverables */}
          <div>
            <Label>Deliverables *</Label>
            <div className="space-y-2">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g. Build responsive dashboard components"
                    value={deliverable}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                  />
                  {deliverables.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDeliverable(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDeliverable}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Deliverable
              </Button>
            </div>
          </div>

          {/* Commitment */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hoursPerWeek">Hours/Week *</Label>
              <Input
                id="hoursPerWeek"
                type="number"
                min="1"
                max="40"
                {...form.register("hoursPerWeek", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="durationWeeks">Duration (weeks) *</Label>
              <Input
                id="durationWeeks"
                type="number"
                min="1"
                max="52"
                {...form.register("durationWeeks", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
              />
            </div>
          </div>

          {/* Compensation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Compensation Type *</Label>
              <Select onValueChange={(value) => form.setValue("compensationType", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="stipend">Stipend</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="compensationRange">Range (optional)</Label>
              <Input
                id="compensationRange"
                placeholder="e.g. $40-60/hour"
                {...form.register("compensationRange")}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label>Location *</Label>
            <Select onValueChange={(value) => form.setValue("location", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags *</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Posting..." : "Post Opportunity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};