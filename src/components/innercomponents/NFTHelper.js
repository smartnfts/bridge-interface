
import { checkVideoFormat, checkImageFormat } from "../../wallet/oldHelper"
import { isValidHttpUrl } from '../../wallet/helpers'


export const getCorrectURL = nft => {
    // debugger
    const { image, uri, animation_url, image_url, data } = nft
    if(animation_url && checkVideoFormat(animation_url)) return {video: true, url: animation_url}
    else if(animation_url && !checkVideoFormat(animation_url) && !checkImageFormat(animation_url)) return {video: false, url: data?.image || image || image_url || uri}
    else if(animation_url && !checkVideoFormat(animation_url)) return {video: false, url: animation_url}
    else return {video: false, url: data?.image || image || image_url || uri }
}