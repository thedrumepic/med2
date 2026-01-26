import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, LogOut, X, Upload } from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category_id: "",
    image: "",
    base_price: 0,
    weight_prices: []
  });
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [weightInput, setWeightInput] = useState({ weight: "", price: "" });

  const authHeader = {
    auth: {
      username: credentials.username,
      password: credentials.password
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/login`, credentials);
      setIsAuthenticated(true);
      toast.success("Вход выполнен успешно");
      fetchData();
    } catch (error) {
      toast.error("Неверные учетные данные");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/products`)
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      toast.error("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Product CRUD
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || "",
        category_id: product.category_id,
        image: product.image,
        base_price: product.base_price,
        weight_prices: product.weight_prices || []
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        category_id: categories[0]?.id || "",
        image: "",
        base_price: 0,
        weight_prices: []
      });
    }
    setProductModalOpen(true);
  };

  const saveProduct = async () => {
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productForm, authHeader);
        toast.success("Товар обновлен");
      } else {
        await axios.post(`${API}/products`, productForm, authHeader);
        toast.success("Товар создан");
      }
      setProductModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Ошибка сохранения товара");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Удалить товар?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, authHeader);
      toast.success("Товар удален");
      fetchData();
    } catch (error) {
      toast.error("Ошибка удаления товара");
    }
  };

  // Category CRUD
  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name, slug: category.slug });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", slug: "" });
    }
    setCategoryModalOpen(true);
  };

  const saveCategory = async () => {
    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, categoryForm, authHeader);
        toast.success("Категория обновлена");
      } else {
        await axios.post(`${API}/categories`, categoryForm, authHeader);
        toast.success("Категория создана");
      }
      setCategoryModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Ошибка сохранения категории");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Удалить категорию?")) return;
    try {
      await axios.delete(`${API}/categories/${id}`, authHeader);
      toast.success("Категория удалена");
      fetchData();
    } catch (error) {
      toast.error("Ошибка удаления категории");
    }
  };

  const addWeightPrice = () => {
    if (weightInput.weight && weightInput.price) {
      setProductForm(prev => ({
        ...prev,
        weight_prices: [...prev.weight_prices, { weight: weightInput.weight, price: parseFloat(weightInput.price) }]
      }));
      setWeightInput({ weight: "", price: "" });
    }
  };

  const removeWeightPrice = (index) => {
    setProductForm(prev => ({
      ...prev,
      weight_prices: prev.weight_prices.filter((_, i) => i !== index)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Админ-панель
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                data-testid="admin-username"
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                data-testid="admin-password"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" data-testid="admin-login-btn">
              Войти
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Админ-панель | Ферма Медовик
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")} data-testid="go-to-site-btn">
              На сайт
            </Button>
            <Button variant="ghost" onClick={() => setIsAuthenticated(false)} data-testid="logout-btn">
              <LogOut className="w-4 h-4 mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="products" data-testid="products-tab">Товары</TabsTrigger>
            <TabsTrigger value="categories" data-testid="categories-tab">Категории</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Управление товарами</h2>
              <Button onClick={() => openProductModal()} className="bg-primary hover:bg-primary/90" data-testid="add-product-btn">
                <Plus className="w-4 h-4 mr-2" />
                Добавить товар
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Фото</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Граммовки</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{categories.find(c => c.id === product.category_id)?.name || "-"}</TableCell>
                      <TableCell>{product.base_price} ₸</TableCell>
                      <TableCell>
                        {product.weight_prices?.length > 0 
                          ? product.weight_prices.map(wp => wp.weight).join(", ")
                          : "-"
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openProductModal(product)} data-testid={`edit-product-${product.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)} data-testid={`delete-product-${product.id}`}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Управление категориями</h2>
              <Button onClick={() => openCategoryModal()} className="bg-primary hover:bg-primary/90" data-testid="add-category-btn">
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Товаров</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{products.filter(p => p.category_id === category.id).length}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openCategoryModal(category)} data-testid={`edit-category-${category.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)} data-testid={`delete-category-${category.id}`}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Modal */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Редактировать товар" : "Добавить товар"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Название</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                data-testid="product-name-input"
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                data-testid="product-description-input"
              />
            </div>
            <div>
              <Label>Категория</Label>
              <Select
                value={productForm.category_id}
                onValueChange={(value) => setProductForm(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger data-testid="product-category-select">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Изображение</Label>
              <div className="flex gap-2">
                <Input
                  value={productForm.image}
                  onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="URL изображения или загрузите файл"
                  data-testid="product-image-input"
                />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button type="button" variant="outline" asChild>
                    <span><Upload className="w-4 h-4" /></span>
                  </Button>
                </label>
              </div>
              {productForm.image && (
                <img src={productForm.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
              )}
            </div>
            <div>
              <Label>Базовая цена (₸)</Label>
              <Input
                type="number"
                value={productForm.base_price}
                onChange={(e) => setProductForm(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
                data-testid="product-price-input"
              />
            </div>
            <div>
              <Label>Граммовки и цены</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Вес (напр. 250гр)"
                  value={weightInput.weight}
                  onChange={(e) => setWeightInput(prev => ({ ...prev, weight: e.target.value }))}
                  data-testid="weight-input"
                />
                <Input
                  type="number"
                  placeholder="Цена"
                  value={weightInput.price}
                  onChange={(e) => setWeightInput(prev => ({ ...prev, price: e.target.value }))}
                  data-testid="weight-price-input"
                />
                <Button type="button" variant="outline" onClick={addWeightPrice} data-testid="add-weight-btn">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {productForm.weight_prices.map((wp, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded">
                    <span>{wp.weight} - {wp.price} ₸</span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeWeightPrice(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setProductModalOpen(false)}>Отмена</Button>
              <Button onClick={saveProduct} className="bg-primary hover:bg-primary/90" data-testid="save-product-btn">
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Редактировать категорию" : "Добавить категорию"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Название</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                data-testid="category-name-input"
              />
            </div>
            <div>
              <Label>Slug (для URL)</Label>
              <Input
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                data-testid="category-slug-input"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>Отмена</Button>
              <Button onClick={saveCategory} className="bg-primary hover:bg-primary/90" data-testid="save-category-btn">
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
