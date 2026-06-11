import AppLayout from "@/components/layout/AppLayout";
import { ReactNode } from "react";


export default function HomeLayout({children}: {children: ReactNode}) {
    return <>
        <AppLayout>
            {children}
        </AppLayout>
    </>
}