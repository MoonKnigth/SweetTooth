import MainApp from '@/components/MainApp';
import { AppProvider } from '@/context/AppContext';

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
