import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Building } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  capacity?: number;
  manager_name?: string;
  manager_contact?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export function SimplifiedWarehouseMaster() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: '1',
      name: 'Main Warehouse',
      code: 'WH001',
      address: '123 Industrial Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      capacity: 50000,
      manager_name: 'John Doe',
      manager_contact: '+91-9876543210',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Secondary Storage',
      code: 'WH002', 
      address: '456 Warehouse District',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      capacity: 30000,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    capacity: "",
    manager_name: "",
    manager_contact: "",
    status: "active" as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const warehouseData = {
        id: editingWarehouse?.id || Date.now().toString(),
        name: formData.name,
        code: formData.code,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        capacity: formData.capacity ? parseFloat(formData.capacity) : undefined,
        manager_name: formData.manager_name || undefined,
        manager_contact: formData.manager_contact || undefined,
        status: formData.status,
        created_at: editingWarehouse?.created_at || new Date().toISOString()
      };

      if (editingWarehouse) {
        setWarehouses(prev => prev.map(warehouse => 
          warehouse.id === editingWarehouse.id ? warehouseData : warehouse
        ));
        toast({
          title: "Success",
          description: "Warehouse updated successfully!",
        });
      } else {
        setWarehouses(prev => [...prev, warehouseData]);
        toast({
          title: "Success",
          description: "Warehouse created successfully!",
        });
      }

      setShowDialog(false);
      setEditingWarehouse(null);
      resetForm();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      toast({
        title: "Error",
        description: "Failed to save warehouse",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      city: warehouse.city,
      state: warehouse.state,
      pincode: warehouse.pincode,
      capacity: warehouse.capacity?.toString() || "",
      manager_name: warehouse.manager_name || "",
      manager_contact: warehouse.manager_contact || "",
      status: warehouse.status
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setWarehouses(prev => prev.filter(warehouse => warehouse.id !== id));
      toast({
        title: "Success",
        description: "Warehouse deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      toast({
        title: "Error",
        description: "Failed to delete warehouse",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      capacity: "",
      manager_name: "",
      manager_contact: "",
      status: "active"
    });
  };

  const openDialog = () => {
    setEditingWarehouse(null);
    resetForm();
    setShowDialog(true);
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Warehouse Master
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your warehouse locations and facilities
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={openDialog} className="bg-gradient-primary hover:bg-gradient-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Warehouse Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Warehouse Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity (sq ft)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manager_name">Manager Name</Label>
                  <Input
                    id="manager_name"
                    value={formData.manager_name}
                    onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="manager_contact">Manager Contact</Label>
                  <Input
                    id="manager_contact"
                    value={formData.manager_contact}
                    onChange={(e) => setFormData({ ...formData, manager_contact: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-primary hover:bg-gradient-primary/90">
                  {editingWarehouse ? 'Update' : 'Create'} Warehouse
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-erp-md">
        <CardHeader>
          <CardTitle>Warehouses ({filteredWarehouses.length})</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{warehouse.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Code: {warehouse.code}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{warehouse.city}</div>
                        <div className="text-xs text-muted-foreground">
                          {warehouse.state} - {warehouse.pincode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {warehouse.manager_name ? (
                        <div>
                          <div className="text-sm font-medium">{warehouse.manager_name}</div>
                          {warehouse.manager_contact && (
                            <div className="text-xs text-muted-foreground">
                              {warehouse.manager_contact}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {warehouse.capacity ? (
                        <div>
                          <div className="font-medium">{warehouse.capacity.toLocaleString()} sq ft</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={warehouse.status === 'active' ? 'default' : 'secondary'}>
                        {warehouse.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(warehouse)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(warehouse.id)}
                          className="text-error hover:text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}