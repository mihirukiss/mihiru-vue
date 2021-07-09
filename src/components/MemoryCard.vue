<template>
    <v-card class="memory-card my-2" width="100%">
        <v-card-text class="user-profile" v-if="memory.user_profile">
            <img class="avatar" :src="dataUrlPrefix +'img/' + memory.user_profile.face + '@48w_48h' + (memory.user_profile.face.endsWith('.gif')?'.gif':'.jpg')" />
            <div class="user-info">
                <div class="user-name">{{ memory.user_profile.uname }}</div>
                <div class="time">{{ memoryTime }}</div>
            </div>
        </v-card-text>
        <v-card-text class="user-profiles" v-if="memory.user_profiles">
            <div class="pb-1" v-for="(user, index) in memory.user_profiles" v-bind:key="memory.id + '_user_' + index">
                <img class="avatar" :src="dataUrlPrefix +'img/' + user.face + '@48w_48h' + (user.face.endsWith('.gif')?'.gif':'.jpg')" />
                <div class="user-info">
                    <div class="user-name"><span class="user-type">{{ user.utype }}</span>{{ user.uname }}</div>
                    <div class="time" v-if="index == memory.user_profiles.length - 1">{{ memoryTime }}</div>
                </div>
            </div>
        </v-card-text>
        <v-card-text class="memory-content">
            <div class="article-container" v-if="memory.type == 64">
                <a target="_blank" :href="'https://www.bilibili.com/read/cv' + memory.rid">
                    <div>
                        <div class="images-area">
                            <img class="article-img" :src="dataUrlPrefix +'img/' + memory.image_urls[0] + '@520w_120h_1e_1c' + (memory.image_urls[0].endsWith('.gif')?'.gif':'.jpg')" />
                        </div>
                        <div class="text-area">
                            <div class="title">{{ memory.title }}</div>
                            <div class="content">{{ memory.content }}</div>
                        </div>
                    </div>
                </a>
            </div>
            <div class="video-container" v-else-if="memory.type == 8">
                <a target="_blank" :href="'https://www.bilibili.com/video/' + memory.bvid">
                    <div class="video-wrap">
                        <div class="image-area">
                            <div class="types">投稿视频</div>
                            <img :src="dataUrlPrefix +'img/' + memory.pic + '@203w_127h_1e_1c' + (memory.pic.endsWith('.gif')?'.gif':'.jpg')" />
                        </div>
                        <div class="text-area">
                            <div class="title">{{ memory.title }}</div>
                            <div class="content">{{ memory.desc }}</div>
                        </div>
                    </div>
                </a>
            </div>
            <div v-else-if="memory.content" v-html="contentWithCtrl"></div>
            <div v-else-if="!memory.type">
                {{ (memory.join_user_profiles && memory.join_user_profiles.length > 0)?'与':'' }}<span class="dynamic-link" v-for="(joinUser, index) in memory.join_user_profiles" v-text="'@' + joinUser.uname" v-bind:key="memory.id + '_join_' + index"></span>{{ (memory.join_user_profiles && memory.join_user_profiles.length > 0)?'联动':'' }}开始直播《{{ memory.title }}》
                <a v-if="memory.full_record" class="dynamic-link" target="_blank" :href="memory.full_record">查看完整录播>></a>
            </div>
            <div v-if="pictures.length > 0">
                <viewer :trigger="pictures" :options="options">
                    <template v-for="(picture, index) in pictures">
                        <img class="cursor-zoom-in br-4 mr-1 mb-1" :src="picture.thumb" :data-src="picture.url" v-bind:key="memory.id + '_picture_' + index" />
                    </template>
                </viewer>
            </div>
            <div v-if="memory.origin" class="origin">
                <div class="origin-user-profile">
                    <img class="origin-avatar" :src="dataUrlPrefix +'img/' + memory.origin.user_profile.face + '@24w_24h' + (memory.origin.user_profile.face.endsWith('.gif')?'.gif':'.jpg')" />
                    <div class="origin-user-name">{{ memory.origin.user_profile.uname }}</div>
                    <div class="origin-user-tip" v-if="memory.origin.type == 2">的图片</div>
                </div>
                <div class="article-container" v-if="memory.origin.type == 64">
                    <a target="_blank" :href="'https://www.bilibili.com/read/cv' + memory.origin.rid">
                        <div>
                            <div class="images-area">
                                <img class="article-img" :src="dataUrlPrefix +'img/' + memory.origin.image_urls[0] + '@520w_120h_1e_1c' + (memory.origin.image_urls[0].endsWith('.gif')?'.gif':'.jpg')" />
                            </div>
                            <div class="text-area">
                                <div class="title">{{ memory.origin.title }}</div>
                                <div class="content">{{ memory.origin.content }}</div>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="video-container" v-if="memory.origin.type == 8">
                    <a target="_blank" :href="'https://www.bilibili.com/video/' + memory.origin.bvid">
                        <div class="video-wrap">
                            <div class="image-area">
                                <div class="types">投稿视频</div>
                                <img :src="dataUrlPrefix +'img/' + memory.origin.pic + '@203w_127h_1e_1c' + (memory.origin.pic.endsWith('.gif')?'.gif':'.jpg')" />
                            </div>
                            <div class="text-area">
                                <div class="title">{{ memory.origin.title }}</div>
                                <div class="content">{{ memory.origin.desc }}</div>
                            </div>
                        </div>
                    </a>
                </div>
                <div v-else-if="memory.origin.content" v-html="originContentWithCtrl"></div>
                <div v-if="originPictures.length > 0">
                    <viewer :trigger="originPictures" :options="options">
                        <template v-for="(picture, index) in originPictures">
                            <img class="cursor-zoom-in br-4 mr-1 mb-1" :src="picture.thumb" :data-src="picture.url" v-bind:key="memory.id + index" />
                        </template>
                    </viewer>
                </div>
            </div>
        </v-card-text>
        <template v-for="(cut, index) in memory.cuts">
            <v-card-title class="cut-title" v-bind:key="memory.id + '_cut_title_' + index">{{ cut.title }}</v-card-title>
            <v-card-text class="cut-media" v-bind:key="memory.id + '_cut_media_' + index">
                <video controls preload="none" :src="dataUrlPrefix +'media/' + cut.file" v-if="cut.type == 1"></video>
                <audio controls preload="none" :src="dataUrlPrefix +'media/' + cut.file" v-if="cut.type == 0"></audio>
            </v-card-text>
        </template>
    </v-card>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import moment from 'moment'
import { component as Viewer } from "v-viewer"

export default {
    name: "MemoryCard",
    components: {
        Viewer
    },
    data: ()=>({
        dataUrlPrefix: process.env.VUE_APP_API_MEMORY_DATA_PREFIX,
        options: {
            url: 'data-src',
            title: false
        }
    }),
    computed: {
        memoryTime: function() {
            return moment.unix(this.memory.timestamp).utc(8).format('YYYY-MM-DD HH:mm')
        },
        contentWithCtrl: function() {
            return this.formatContentHtml(this.memory)
        },
        originContentWithCtrl: function() {
            if (!this.memory.origin) {
                return null;
            }
            return this.formatContentHtml(this.memory.origin)
        },
        pictures: function() {
            return this.buildPicturesInfo(this.memory.pictures)
        },
        originPictures: function() {
            if (!this.memory.origin) {
                return [];
            }
            return this.buildPicturesInfo(this.memory.origin.pictures)
        }
    },
    props: {
        memory: Object
    },
    methods: {
        formatContentHtml: function(memory) {
            if (!memory.content) {
                return null;
            } else if (!memory.ctrl) {
                return this.formatTextTag(memory.content);
            }
            let lastIndex = 0;
            const ctrl = memory.ctrl
            let contentHtml = ''
            for (let i = 0; i < ctrl.length; i++) {
                const ctrlPart = ctrl[i];
                if (ctrlPart.location > lastIndex){
                    contentHtml = contentHtml + this.formatTextTag(memory.content.substring(lastIndex, ctrlPart.location))
                }
                if (ctrlPart.type == 1){
                    contentHtml = contentHtml + '<span class="dynamic-link">' + memory.content.substr(ctrlPart.location, ctrlPart.length) + '</span>'
                    lastIndex = ctrlPart.location + ctrlPart.length;
                } else if (ctrlPart.type == 3){
                    contentHtml = contentHtml + '<span class="dynamic-link"><i class="bp-svg-icon vote-btn" />' + memory.content.substr(ctrlPart.location+1, parseInt(ctrlPart.data) - 1) + '</span>'
                    lastIndex = ctrlPart.location + parseInt(ctrlPart.data);
                }
            }
            if(lastIndex < memory.content.length) {
                contentHtml = contentHtml + this.formatTextTag(memory.content.substr(lastIndex))
            }
            return contentHtml
        },
        formatTextTag: function(text) {
            const splitTexts = text.split(/(#\S+?#)/);
            if(splitTexts.length > 1){
                let result = '';
                for (let i = 0; i < splitTexts.length; i++) {
                    if(splitTexts[i].startsWith('#') && splitTexts[i].endsWith('#')){
                        result = result + '<span class="dynamic-link">' + splitTexts[i] + '</span>'
                    } else {
                        result = result + splitTexts[i]
                    }
                }
                return result
            } else {
                return text;
            }
        },
        buildPicturesInfo: function(pictures) {
            if (!pictures || pictures.length < 1) {
                return [];
            }
            const result = new Array()
            for (let i = 0; i < pictures.length; i++) {
                const picture = pictures[i];
                const imageInfo = {};
                imageInfo.url = this.dataUrlPrefix + 'img/' + picture.img_src;
                if (pictures.length > 1) {
                    imageInfo.thumb = imageInfo.url + '@104w_104h_1e_1c' + (imageInfo.url.endsWith('.gif')?'.gif':'.jpg')
                } else {
                    const sizeArray = [180, 240, 320];
                    const ratio = picture.img_width / picture.img_height;
                    let width = picture.img_width
                    let height = picture.img_height
                    if(picture.img_width <= 360){
                        if(ratio >= 1){
                            width = sizeArray[0];
                            height = Math.min(width / ratio, sizeArray[0]);
                        } else if (ratio >= 0.75){
                            width = sizeArray[0];
                            height = Math.min(width / ratio, sizeArray[1]);
                        } else {
                            height = sizeArray[1];
                            width = Math.min(height * ratio, sizeArray[0]);
                        }
                    } else if(picture.img_width <= 960){
                        if(ratio >= 1){
                            width = sizeArray[1];
                            height = Math.min(width / ratio, sizeArray[1]);
                        } else if(ratio >= 0.75){
                            width = sizeArray[1];
                            height = Math.min(width / ratio, sizeArray[2]);
                        } else {
                            width = sizeArray[1];
                            height = sizeArray[2];
                        }
                    } else {
                        if(ratio >= 1){
                            width = sizeArray[2];
                            height = Math.min(width / ratio, sizeArray[2]);
                        } else if(ratio >= 0.75){
                            width = sizeArray[1];
                            height = Math.min(width / ratio, sizeArray[2]);
                        } else {
                            width = sizeArray[1];
                            height = sizeArray[2];
                        }
                    }
                    height = Math.ceil(height);
                    width = Math.ceil(width);
                    imageInfo.thumb = imageInfo.url + '@' + width + 'w_' + height + 'h_1e_1c' + (imageInfo.url.endsWith('.gif')?'.gif':'.jpg')
                }
                result.push(imageInfo)
            }
            return result
        }
    }
}
</script>