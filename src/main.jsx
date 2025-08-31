import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CategoryProvider } from './context/categoryContext.jsx'
import { TaskProvider } from './context/taskContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
		<BrowserRouter>
			<TaskProvider>
				<CategoryProvider>
					<App />
				</CategoryProvider>
			</TaskProvider>
		</BrowserRouter>
  </StrictMode>,
)
