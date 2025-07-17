'use client';
import ResponsiveSafeImage from './ResponsiveSafeImage';

interface MenuModalProps {
  isOpen: boolean;
}

const MenuModal = ({ isOpen }: MenuModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex h-full w-full flex-col items-center justify-center bg-white p-6">
      <h2 className="text-2xl font-bold">Menu</h2>
      <p>Menu content goes here...</p>
      <div className="w-full h-full border-4 border-blue-500 shadow-lg">
        <ResponsiveSafeImage
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="A beautiful landscape"
          // Optional: customize the safe area. 
          // Defaults to x: 0.3 (30%) and y: 0.5 (50%) if not provided.
          // safeArea={{ x: 0.4, y: 0.6 }} 
        />
      </div>
    </div>
  );
};

export default MenuModal;
