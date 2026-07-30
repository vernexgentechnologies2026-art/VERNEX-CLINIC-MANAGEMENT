import { Button, PageHeader } from "../../../components/ui";
import { getQueueItems } from "../../../services/reception.service";
import { QueueBoard } from "../components/QueueBoard";

export default function Queue() {
  return <div className="space-y-5"><PageHeader title="Live Queue" description="Readable token board for waiting, in-consultation, completed, and no-show patients." action={<Button>Call next patient</Button>} /><QueueBoard items={getQueueItems()} /></div>;
}
