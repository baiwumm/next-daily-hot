declare namespace App {

  type WithAsChild<Base extends object> =
    | (Base & { asChild: true; children: React.ReactElement })
    | (Base & { asChild?: false | undefined });

  /**
* @description: 热榜子项
*/
  export type HotListItem = {
    id: string; // 唯一 key
    title: string; // 标题
    desc?: string; // 描述
    pic?: string; // 封面图
    hot: number | string; // 热度
    tip?: string; // 如果不显示热度，显示其他信息
    url: string; // 地址
    mobileUrl: string; // 移动端地址
    label?: string; // 标签（微博）
  };

  /**
   * @description: 接口返回数据格式
   */
  export type IResponse = {
    code: number;
    msg: string;
    data?: HotListItem[];
    timestamp: number;
  };

  /**
   * @description: 榜单配置
   */
  export type HotListConfig = {
    value: typeof import('@/enums').HOT_ITEMS.valueType;
    label: string;
    tip: string;
    prefix?: string; // 前缀
    suffix?: string; // 后缀
  };

}
