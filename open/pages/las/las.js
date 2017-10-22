
Page({
  data: {
    Province: [],//获取到的所有的省
    City: [],//选择的该省的所有市
    Area: [],//选择的该市的所有区县
    Province_index: 0,//picker-view省项选择当前选中的value值（索引index）
    City_index: 0,//picker-view市项当前选择的value值（索引index）
    Area_index: 0,//picker-view区县项当前选择的value值（索引index）
    Resources: null,//取到该数据的所有省市区数据
    ChooseData: {},//最后取到的省市区名字
    AnimationData: {}
  },
  //点击事件，点击弹出选择页
  pushView: function () {
    var that = this;
    //这里写了一个动画，让其高度变为满屏
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    that.animation = animation
    //这里修改：如果我们相适应屏幕就不能是固定值
    //第一次是auto，会出现，但是没有动画效果，然后100%测试成功
     animation.height('100%').step()
    that.setData({
      AnimationData: animation.export()
    })

  },
  //取消按钮
  cancleClick: function () {
    //这里也是动画，然其高度变为0
    //一般我们常识是：取消我们是关闭某些页面并且伴随清空一些赋值等附加操作
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    that.animation = animation
    animation.height(0 + 'rpx').step()
    that.setData({
      AnimationData: animation.export()
    });
    //取消不传值，这里就把ChooseData 的值赋值为{}
    that.setData({
      ChooseData: {}
    });
    console.log(this.data.ChooseData);
  },
  //确认按钮
  confirmClick: function () {
    //一样是动画，级联选择页消失，效果和取消一样
    //确定：我们会给变量赋值的操作
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(0 + 'rpx').step()
    this.setData({
      AnimationData: animation.export()
    });
    //打印最后选取的结果
    console.log(this.data.ChooseData);
  },
  //滚动选择的时候触发事件
  bindChange: function (e) {
    //这里是获取picker-view内的picker-view-column 当前选择的是第几项
    const val = e.detail.value
    //因为我们只有三列所以肯定是val[0]、val[1]、val[2]
    this.setData({
      Province_index: val[0],
      City_index: val[1],
      Area_index: val[2]
    })
    this.casCade();
    console.log(val);

    console.log(this.data.ChooseData);
  },
  //这里是判断省市名称的显示
  casCade: function () {
    var that = this,
      Resources = that.data.Resources,//数据源
      Province = [],
      City = [],
      Area = [],
      Area_index = that.data.Area_index,//当前索引位置
      City_index = that.data.City_index,//当前索引位置
      Province_index = that.data.Province_index;//当前索引位置
    //遍历所有的省，将省的名字存到Province这个数组中
    for (let i = 0; i < Resources.length; i++) {
      Province.push(Resources[i].name)
    }

    if (Resources[Province_index].regions) {//这里判断这个省级里面有没有市（如数据中的香港、澳门等就没有写市）
      if (Resources[Province_index].regions[City_index]) {//这里是判断这个选择的省里面，有没有相应的下标为City_index的市，因为这里的下标是前一次选择后的下标，比如之前选择的一个省有10个市，我刚好滑到了第十个市，现在又重新选择了省，但是这个省最多只有5个市，但是这时候的City_index为9，而这里的市根本没有那么多，所以会报错
        //这里如果有这个市，那么把选中的这个省中的所有的市的名字保存到City这个数组中
        for (let i = 0; i < Resources[Province_index].regions.length; i++) {
          City.push(Resources[Province_index].regions[i].name);
        }
        console.log('执行了区级判断');

        if (Resources[Province_index].regions[City_index].regions) {//这里是判断选择的这个市在数据里面有没有区县
          if (Resources[Province_index].regions[City_index].regions[Area_index]) {//这里是判断选择的这个市里有没有下标为Area_index的区县，道理同上面市的选择
            console.log('这里判断有没有进区里');
            //有的话，把选择的这个市里面的所有的区县名字保存到Area这个数组中
            for (let i = 0; i < Resources[Province_index].regions[City_index].regions.length; i++) {
              console.log('这里是写区得');
              Area.push(Resources[Province_index].regions[City_index].regions[i].name);
            }
          } else {
            //这里和选择市的道理一样
            that.setData({
              Area_index: 0
            });
            for (let i = 0; i < Resources[Province_index].regions[City_index].regions.length; i++) {
              Area.push(Resources[Province_index].regions[City_index].regions[i].name);
            }
          }
        } else {
          //如果这个市里面没有区县，那么把这个市的名字就赋值给Area这个数组
          Area.push(Resources[Province_index].regions[City_index].name);
        }
      } else {
        //如果选择的省里面没有下标为City_index的市，那么把这个下标的值赋值为0；然后再把选中的该省的所有的市的名字放到City这个数组中
        that.setData({
          City_index: 0
        });
        for (let i = 0; i < Resources[Province_index].regions.length; i++) {
          City.push(Resources[Province_index].regions[i].name);
        }

      }
    } else {
      //如果该省级没有市，那么就把省的名字作为市和区的名字
      City.push(Resources[Province_index].name);
      Area.push(Resources[Province_index].name);
    }

    console.log(Province);
    console.log(City);
    console.log(Area);
    //选择成功后把相应的数组赋值给相应的变量
    that.setData({
      Province: Province,
      City: City,
      Area: Area
    });
    //有时候网络慢，会出现区县选择出现空白，这里是如果出现空白那么执行一次回调
    if (Province.length == 0 || City.length == 0 || Area.length == 0) {
      that.casCade();
      console.log('这里执行了回调');
      // console.log();
    }
    console.log(Province[that.data.Province_index]);
    console.log(City[that.data.City_index]);
    console.log(Area[that.data.Area_index]);
    //把选择的省市区都放到ChooseData中
    let ChooseData = {
      Province: Province[that.data.Province_index],
      City: City[that.data.City_index],
      Area: Area[that.data.Area_index]
    };

    that.setData({
      ChooseData: ChooseData
    });

  },
  onLoad: function () {
    var that = this;
    //请求省市区的数据
    wx.request({
      url: 'https://wxxapp.duapp.com/quanguo.json',
      data: {},
      method: 'GET',
      success: function (res) {
        // success

        console.log(res.data.regions);
        // Resources=res.data.regions
        that.setData({
          Resources: res.data.regions
        });
        that.casCade();
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })


  }
})