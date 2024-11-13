const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        {children}
      </div>
    );
  };
  
  export default Layout;
  