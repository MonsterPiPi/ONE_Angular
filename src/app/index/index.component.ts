import { Component, OnInit } from '@angular/core';
import {GetDataService} from "../serve/get-data.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['index.component.scss']
})
export class IndexComponent implements OnInit {
  currentId:string; //今日Id
  windowHeight:number = 0;
  indexImageText:IndexImageText = new IndexImageText('0','2017-10-26 06:00:00','xxx','VOL.1846','xxx');
  currentIdArray = {
    reading:0,
    music:0,
    movie:0,
  }
  reading:IndexCategory = new IndexCategory('0','2017-10-26 06:00:00','xxx','VOL.1846','xxx','xxx');
  music:IndexCategory = new IndexCategory('0','2017-10-26 06:00:00','xxx','VOL.1846','xxx','xxx');
  movie:IndexCategory = new IndexCategory('0','2017-10-26 06:00:00','xxx','VOL.1846','xxx','xxx');
  constructor(private getDataService:GetDataService) { }

  ngOnInit() {
    const _this = this;
    this.windowHeight = window.innerHeight;
    // console.log(this.windowHeight);
    _this.getDataService.getIdList().subscribe(
      result=>{
        _this.currentId = result.data[0];
        _this.getIndexDetail(_this.currentId);
      }
    );
  }

  /**
   * 获取首页数据
   * @param id
   */
  getIndexDetail(id:string){
    const _this = this;
    _this.getDataService.getImageTextDetail(id).subscribe(
      result=>{
        let data = result.data;
        for(let item of result.data.content_list){
          switch (item.category){
            case "0":
              _this.indexImageText = new IndexImageText(item.id,data.date,item.img_url,item.volume,item.forward);
              break;
            case "1":
              _this.reading = new IndexCategory(item.id,'阅读',item.img_url,item.author.user_name,item.title,item.forward);
              break;
            case "4":
              _this.music = new IndexCategory(item.id,'音乐',item.img_url,item.author.user_name,item.title,item.forward);
              break;
            case "5":
              _this.movie = new IndexCategory(item.id,'影视',item.img_url,item.author.user_name,item.title,item.forward);
              break;
          }
        }
      })
  }

  getFirstReadingList(id:string='0'){
    const _this = this;
    _this.getDataService.getReadings(id).subscribe(
      result=>{
        _this.currentIdArray.reading = result.data[0].id;
        let data = result.data;
        _this.reading = new IndexCategory(data[0].id,'阅读',data[0].img_url,data[0].author.user_name,data[0].title,data[0].forward);
        console.log(_this.reading);
      }
    )
  }

  getFirstMusicList(id:string='0'){
    const _this = this;
    _this.getDataService.getMusics(id).subscribe(
      result=>{
        _this.currentIdArray.music = result.data[0].id;
        let data = result.data;
        _this.music = new IndexCategory(data[0].id,'音乐',data[0].img_url,data[0].author.user_name,data[0].title,data[0].forward);
      }
    );
  }

  getFirstMoviesList(id:string='0'){
    const _this = this;
    _this.getDataService.getMovies(id).subscribe(
      result=>{
        _this.currentIdArray.movie = result.data[0].id;
        let data = result.data;
        _this.movie = new IndexCategory(data[0].id,'影视',data[0].img_url,data[0].author.user_name,data[0].title,data[0].forward);
      }
    );
  }


}

class IndexImageText{
  constructor(
    public id:string,
    public date:string,  //时间
    public picUrl:string,
    public volume:string, //编号
    public title:string  //标题语
  ){}
}


// 主页分类数据对象
export class IndexCategory{
  constructor(
    public id:string,
    public category:string, //类型(阅读:1 音乐:4 影视:5)
    public picUrl:string,
    public authorName:string,
    public title:string, //标题
    public content:string, //正文
    public date?:string
  ){}
}
