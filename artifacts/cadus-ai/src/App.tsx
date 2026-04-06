import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiAssistant from "@/pages/AiAssistant";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AiAssistant />
    </QueryClientProvider>
  );
}

export default App;
