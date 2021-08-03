import dynamic from 'next/dynamic';
const PoseNetComponent = dynamic(() => import('./../components/PoseNetComponent'), {
  ssr: true,
});

export default function peopleCounter() {
    return (
        <div>
            <PoseNetComponent/>
        </div>
    )
}
