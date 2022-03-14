import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Search from "../../assets/img/icons/Search.svg";
import { ReactComponent as SearchComp } from "../../assets/img/icons/Search.svg";
import { setSearchNFTList } from '../../store/reducers/generalSlice';
export default function NFTSearch() {

    const dispatch = useDispatch()
    const widget = useSelector((state) => state.general.widget);
  const [icon, setIcon] = useState(true)

    const handleSearch = (e) => {
        dispatch(setSearchNFTList(e.target.value));
      };

  return (
    
    <Dropdown className="search-dropdown" autoClose="outside">
      <Dropdown.Toggle id="SearchDrop">
      </Dropdown.Toggle>
      <Dropdown.Menu>
        
          <input
            onChange={(e) => handleSearch(e)}
            type="text"
            placeholder="Search NFT"
          />
          {/* { search ?  <button type="button"><img src={Close} alt="" /></button> : <button type="button"><img src={Search} alt=""/></button>} */}
          {/* <button type="button">
            {widget ? (
              <SearchComp className="svgWidget" />
            ) : (
              <img src={Search} alt="#" />
            )}
          </button> */}
        
      </Dropdown.Menu>
    </Dropdown>
  
  )
}