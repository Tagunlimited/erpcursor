import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FabricVariant {
  id?: string;
  color: string;
  gsm: string;
  description?: string;
  stock_quantity?: number;
  rate_per_meter?: number;
}

interface Fabric {
  id: string;
  name: string;
  description: string;
  color: string;
  gsm?: string;
  created_at: string;
  variants: FabricVariant[];
}

export function FabricManager() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    variants: [{ color: '', gsm: '', description: '', stock_quantity: 0, rate_per_meter: 0 }] as FabricVariant[]
  });

  const fetchFabrics = async () => {
    try {
      // Fetch fabrics and their variants
      const { data: fabricsData, error: fabricsError } = await supabase
        .from('fabrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (fabricsError) throw fabricsError;

      // Fetch variants for each fabric
      const fabricsWithVariants = await Promise.all(
        (fabricsData || []).map(async (fabric) => {
          const { data: variants, error: variantsError } = await supabase
            .from('fabric_variants')
            .select('*')
            .eq('fabric_id', fabric.id)
            .order('color');

          if (variantsError) {
            console.error('Error fetching variants for fabric:', fabric.id, variantsError);
          }

          // Combine main fabric data as first variant with additional variants
          const allVariants = [
            {
              id: fabric.id,
              color: fabric.color,
              gsm: fabric.gsm || '',
              description: '',
              stock_quantity: 0,
              rate_per_meter: 0
            },
            ...(variants || [])
          ];

          return {
            ...fabric,
            variants: allVariants
          };
        })
      );

      setFabrics(fabricsWithVariants);
    } catch (error) {
      console.error('Error fetching fabrics:', error);
      toast.error('Failed to fetch fabrics');
    }
  };

  useEffect(() => {
    fetchFabrics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fabricData = {
        name: formData.name,
        description: formData.description
      };

      let fabricId: string;

      if (editingFabric) {
        // For existing fabrics, we need to use the original table structure
        // Update the first variant as the main fabric record
        const mainVariant = formData.variants[0];
        const updateData = {
          name: formData.name,
          description: formData.description,
          color: mainVariant?.color || '',
          gsm: mainVariant?.gsm || ''
        };

        const { error } = await supabase
          .from('fabrics')
          .update(updateData)
          .eq('id', editingFabric.id);

        if (error) throw error;
        fabricId = editingFabric.id;

        // Delete existing variants
        await supabase
          .from('fabric_variants')
          .delete()
          .eq('fabric_id', fabricId);
      } else {
        // For new fabrics, create with the first variant data
        const mainVariant = formData.variants[0];
        const newFabricData = {
          name: formData.name,
          description: formData.description,
          color: mainVariant?.color || '',
          gsm: mainVariant?.gsm || ''
        };

        const { data: newFabric, error } = await supabase
          .from('fabrics')
          .insert(newFabricData)
          .select()
          .single();

        if (error) throw error;
        fabricId = newFabric.id;
      }

      // Insert additional variants (skip the first one as it's stored in main table)
      if (formData.variants.length > 1) {
        const variantsToInsert = formData.variants
          .slice(1) // Skip first variant as it's stored in main fabric table
          .filter(variant => variant.color.trim() !== '')
          .map(variant => ({
            fabric_id: fabricId,
            color: variant.color,
            gsm: variant.gsm || '',
            description: variant.description || '',
            stock_quantity: variant.stock_quantity || 0,
            rate_per_meter: variant.rate_per_meter || 0
          }));

        if (variantsToInsert.length > 0) {
          const { error: variantsError } = await supabase
            .from('fabric_variants')
            .insert(variantsToInsert);

          if (variantsError) throw variantsError;
        }
      }

      toast.success(`Fabric ${editingFabric ? 'updated' : 'created'} successfully`);
      setDialogOpen(false);
      setEditingFabric(null);
      setFormData({ 
        name: '', 
        description: '', 
        variants: [{ color: '', gsm: '', description: '', stock_quantity: 0, rate_per_meter: 0 }]
      });
      fetchFabrics();
    } catch (error) {
      console.error('Error saving fabric:', error);
      toast.error('Failed to save fabric');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fabric: Fabric) => {
    setEditingFabric(fabric);
    setFormData({
      name: fabric.name,
      description: fabric.description,
      variants: fabric.variants.length > 0 
        ? fabric.variants.map(v => ({ 
            color: v.color,
            gsm: v.gsm || '',
            description: v.description || '',
            stock_quantity: v.stock_quantity || 0,
            rate_per_meter: v.rate_per_meter || 0
          }))
        : [{ color: fabric.color || '', gsm: fabric.gsm || '', description: '', stock_quantity: 0, rate_per_meter: 0 }]
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fabric and all its variants?')) return;

    try {
      // Delete variants first (due to foreign key constraint)
      await supabase
        .from('fabric_variants')
        .delete()
        .eq('fabric_id', id);

      // Then delete the fabric
      const { error } = await supabase
        .from('fabrics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Fabric deleted successfully');
      fetchFabrics();
    } catch (error) {
      console.error('Error deleting fabric:', error);
      toast.error('Failed to delete fabric');
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', gsm: '', description: '', stock_quantity: 0, rate_per_meter: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const updateVariant = (index: number, field: keyof FabricVariant, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const openDialog = () => {
    setEditingFabric(null);
    setFormData({ 
      name: '', 
      description: '', 
      variants: [{ color: '', gsm: '', description: '', stock_quantity: 0, rate_per_meter: 0 }]
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Fabric Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog} className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Fabric
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingFabric ? 'Edit Fabric' : 'Add New Fabric'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Fabric Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1"
                    placeholder="Additional details about the fabric..."
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Color & GSM Variants</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Variant
                  </Button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 border rounded-lg bg-muted/30">
                      <div>
                        <Label className="text-xs">Color *</Label>
                        <Input
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          placeholder="e.g., Red, Blue"
                          required
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">GSM</Label>
                        <Input
                          value={variant.gsm}
                          onChange={(e) => updateVariant(index, 'gsm', e.target.value)}
                          placeholder="e.g., 180, 200"
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Stock Qty</Label>
                        <Input
                          type="number"
                          value={variant.stock_quantity}
                          onChange={(e) => updateVariant(index, 'stock_quantity', Number(e.target.value))}
                          placeholder="0"
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rate/Meter</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.rate_per_meter}
                          onChange={(e) => updateVariant(index, 'rate_per_meter', Number(e.target.value))}
                          placeholder="0.00"
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Notes</Label>
                        <Input
                          value={variant.description}
                          onChange={(e) => updateVariant(index, 'description', e.target.value)}
                          placeholder="Optional notes"
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          disabled={formData.variants.length === 1}
                          className="h-9 w-9 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="px-6 bg-gradient-to-r from-primary to-primary/90">
                  {loading ? 'Saving...' : editingFabric ? 'Update Fabric' : 'Create Fabric'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-lg">Fabrics List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fabric Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Variants (Color/GSM)</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fabrics.map((fabric) => (
                <TableRow key={fabric.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-foreground">{fabric.name}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground line-clamp-2">{fabric.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {fabric.variants.slice(0, 3).map((variant, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {variant.color} {variant.gsm && `(${variant.gsm})`}
                        </Badge>
                      ))}
                      {fabric.variants.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{fabric.variants.length - 3} more
                        </Badge>
                      )}
                      {fabric.variants.length === 0 && (
                        <span className="text-xs text-muted-foreground">No variants</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(fabric)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(fabric.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}