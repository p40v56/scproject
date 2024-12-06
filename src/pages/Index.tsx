import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:20px_20px]" />
      <div className="w-full max-w-md space-y-8 p-8 glass-effect rounded-2xl shadow-xl fade-in relative">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-900">
            Junior Connect Hub
          </h1>
          <p className="text-slate-600">
            Votre portail de gestion centralisé
          </p>
        </div>
        <div className="scale-in">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;