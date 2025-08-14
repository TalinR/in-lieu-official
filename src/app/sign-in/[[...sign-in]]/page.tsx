import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';


export default function Page() {
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <Image 
          src="/images/logo/black_logo.svg" 
          alt="Logo" 
          width={120} 
          height={60}
          priority
        />
        
        <SignIn 
        signUpUrl="/sign-up"
        appearance={{
            variables: {
                colorPrimary: "#6366f1",
                borderRadius: "0.5rem",
              },
          elements: {
            footer: {
                "& > div": {
                  display: "none",
                }, 
            }, 
            headerTitle: {
              fontSize: "24px",
              fontWeight: "300",
            },
            
            // header: {
            //     display: "none",
            //   },
          }
        }}
      />
      </div>
    </div>
  );
}


