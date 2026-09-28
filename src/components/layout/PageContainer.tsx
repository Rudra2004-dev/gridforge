import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";


interface PageContainerProps {
    children: ReactNode;
}

function PageContainer ({children} : PageContainerProps){
    return(
        <div className="app-layout">
            <Sidebar/>

            <div className="content-area">
             <Header/>

             <main className="main-content">
                {children}
             </main>
            </div>
        </div>
    );
}

export default PageContainer;