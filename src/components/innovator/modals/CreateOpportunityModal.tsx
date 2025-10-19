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
      <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">Post New Opportunity</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Role Title */}
          <div>
            <Label htmlFor="role" className="text-sm font-medium">Role Title *</Label>
            <Input
              id="role"
              placeholder="e.g. Senior React Developer"
              className="mt-1.5 h-11 text-base"
              {...form.register("role")}
            />
            {form.formState.errors.role && (
              <p className="text-xs sm:text-sm text-red-500 mt-1.5">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="mt-1.5 min-h-[100px] sm:min-h-[120px] text-base resize-none"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs sm:text-sm text-red-500 mt-1.5">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Deliverables */}
          <div>
            <Label className="text-sm font-medium">Deliverables *</Label>
            <div className="space-y-2 mt-1.5">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g. Build responsive dashboard"
                    value={deliverable}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                    className="h-11 text-base"
                  />
                  {deliverables.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDeliverable(index)}
                      className="h-11 w-11 shrink-0"
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
                className="w-full sm:w-auto h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Deliverable
              </Button>
            </div>
          </div>

          {/* Commitment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="hoursPerWeek" className="text-sm font-medium">Hours/Week *</Label>
              <Input
                id="hoursPerWeek"
                type="number"
                min="1"
                max="40"
                className="mt-1.5 h-11 text-base"
                {...form.register("hoursPerWeek", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="durationWeeks" className="text-sm font-medium">Duration (weeks) *</Label>
              <Input
                id="durationWeeks"
                type="number"
                min="1"
                max="52"
                className="mt-1.5 h-11 text-base"
                {...form.register("durationWeeks", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                className="mt-1.5 h-11 text-base"
                {...form.register("startDate")}
              />
            </div>
          </div>

          {/* Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="text-sm font-medium">Compensation Type *</Label>
              <Select 
                onValueChange={(value) => form.setValue("compensationType", value as any)}
                defaultValue="paid"
              >
                <SelectTrigger className="mt-1.5 h-11">
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
              <Label htmlFor="compensationRange" className="text-sm font-medium">Range (optional)</Label>
              <Input
                id="compensationRange"
                placeholder="e.g. $40-60/hour"
                className="mt-1.5 h-11 text-base"
                {...form.register("compensationRange")}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-medium">Location *</Label>
            <Select 
              onValueChange={(value) => form.setValue("location", value as any)}
              defaultValue="remote"
            >
              <SelectTrigger className="mt-1.5 h-11">
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
            <Label className="text-sm font-medium">Tags *</Label>
            <div className="space-y-2 mt-1.5">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="h-11 text-base"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addTag}
                  className="h-11 px-4 shrink-0"
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer px-2.5 py-1.5 text-sm"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="w-3 h-3 ml-1.5" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11"
            >
              {isSubmitting ? "Posting..." : "Post Opportunity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};