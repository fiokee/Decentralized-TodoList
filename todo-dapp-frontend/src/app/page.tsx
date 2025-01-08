
import TaskPage from "./components/TaskPage";
import TaskList from "./components/TaskList";
import ConnectWallet from "./components/ConnectWallet";
export default function Home() {

    return (
    <div >
      <ConnectWallet/>
       {/* <TaskList/> */}
       <TaskPage/>
    </div>
  );
}
