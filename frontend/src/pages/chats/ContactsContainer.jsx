import ProfileInfo from "./ProfileInfo";
import NewDM from "./NewDM";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTE, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./CreateChannel";
function ContactsContainer() {
  const {setDirectMessagesContacts,directMessagesContacts,channels,setChannels}= useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if(response.data.contacts){
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if(response.data.channels){
        setChannels(response.data.channels);
      }
    };
    getContacts();
    getChannels();
  }, []);
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
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center  pr-10 justify-between">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={channels} ischannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
