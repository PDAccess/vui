import EmptyState from "../components/EmptyState";
import InitialState from "../components/InitialState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import MainLayout from "../components/MainLayout";
import DatePicker from "../components/DatePickerComp";
import Modal from "../components/Modal";
import ProfileAvatar from "../components/ProfileAvatar";
import UserView from "../components/UserView";
import TimingComp from "../components/TimingComp";
import Multiselect from "vue-multiselect";
import CopyButton from "../components/CopyButton";
import ServiceView from "../components/ServiceView";
import GroupView from "../components/GroupView";
import AvatarLoading from "../components/AvatarLoading";
import CredentialView from "../components/CredentialView";

const PDAccessPlugin = {
  install(Vue) {
    Vue.component("p-empty", EmptyState);
    Vue.component("p-initial", InitialState);
    Vue.component("p-loading", LoadingState);
    Vue.component("p-error", ErrorState);
    Vue.component("p-card", MainLayout);
    Vue.component("p-date-picker", DatePicker);
    Vue.component("p-modal", Modal);
    Vue.component("p-profile-avatar", ProfileAvatar);
    Vue.component("p-select", Multiselect);
    Vue.component("p-timing", TimingComp);
    Vue.component("p-copy", CopyButton);
    Vue.component("p-user", UserView);
    Vue.component("p-service", ServiceView);
    Vue.component("p-group", GroupView);
    Vue.component("p-avatar-loading", AvatarLoading);
    Vue.component("p-credential", CredentialView);
  },
};

export default PDAccessPlugin;
