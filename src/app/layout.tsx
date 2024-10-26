import './globals.css'  
 
export default function Layout({ children }: { children: React.ReactNode }) {
// -  return children
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}