import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteConfirmDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  title, 
  itemData, 
  itemType 
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const renderItemDetails = () => {
    if (!itemData) return null;

    switch (itemType) {
      case 'order':
        return (
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Клиент:</span>
              <span className="font-medium text-gray-800">{itemData.customer_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Телефон:</span>
              <span className="font-medium text-gray-800">{itemData.customer_phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Сумма:</span>
              <span className="font-medium text-gray-800">{itemData.total} ₸</span>
            </div>
          </div>
        );
      
      case 'product':
        return (
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Название:</span>
              <span className="font-medium text-gray-800">{itemData.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Цена:</span>
              <span className="font-medium text-gray-800">{itemData.base_price} ₸</span>
            </div>
          </div>
        );
      
      case 'category':
        return (
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Название:</span>
              <span className="font-medium text-gray-800">{itemData.name}</span>
            </div>
          </div>
        );
      
      case 'promocode':
        return (
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Код:</span>
              <span className="font-medium text-gray-800">{itemData.code}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Скидка:</span>
              <span className="font-medium text-gray-800">
                {itemData.discount_type === 'percent' 
                  ? `${itemData.discount_value}%` 
                  : `${itemData.discount_value} ₸`}
              </span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Вы уверены, что хотите удалить?
          </p>
          {renderItemDetails()}
          <p className="text-xs text-red-600">
            ⚠️ Это действие нельзя отменить
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Удалить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
