import ProfileInfo from "./ProfileInfo"
import NewDM from "./NewDM"
function ContactsContainer() {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <span className="text-purple-500 text-4xl p-5">🤖 Chatty</span>
      </div>
      <div className="my-5">
          <div className="flex items-center justify-between pr-10">
              <Title text="Direct Messages" />
              <NewDM />
          </div>
      </div>
      <div className="my-5">
          <div className="flex items-center  pr-10">
              <Title text="Channels" />
          </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactsContainer

const Title =({text})=>{
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  )
}