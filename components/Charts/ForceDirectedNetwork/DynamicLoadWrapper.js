import dynamic from "next/dynamic";

const ForceDirectedNetwork = dynamic(() => import('./ForceDirectedNetwork'), {
    ssr: false
});

export default ForceDirectedNetwork