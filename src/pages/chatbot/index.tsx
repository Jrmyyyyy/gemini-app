import Chat from "./chat";

const Chatbot = () => {
  return (
    <>
      <div className="flex justify-end mr-14 pt-5"></div>
      <div className="flex items-center gap-y-3 flex-col py-10">
        <h1 className="tracking-tight text-4xl sm:text-6xl font-bold text-black">
          Naturopathic Doctor
        </h1>
        <p className="max-w-xl text-center text-lg text-slate-400">
          Trained in naturopathic medicine, combines traditional healing methods with modern science, 
          emphasizing natural remedies and the body's ability to heal itself.
        </p>
      </div>
      <Chat />
    </>
  );
};

export default Chatbot;
