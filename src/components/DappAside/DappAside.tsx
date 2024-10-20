import { IMenu } from "@/types";
import MenuItem from "./Menu";

const SideBar = ({ menuList }: { menuList: IMenu[] }) => {
  return (
    <div className="p-[20px] h-full border-solid border-r border-[#adadad]">
      <div>
        {menuList.map((menu) => (
          <div key={menu.menuName} className="flex flex-col gap-2">
            <div className="text-[--basic-text] font-bold">{menu.menuName}</div>
            {menu.list.map((item) => (
              <MenuItem item={item} key={item.title} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar;