import { createBrowserRouter } from 'react-router-dom';

// project import
import LandingRoutes from './LandingRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([LandingRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
