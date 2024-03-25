/**
 * Notes: 兼职模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const LostService = require('../service/lost_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class LostController extends BaseProjectController {

	/** 点赞 */
	async likeLost() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		return await service.likeLost(this._userId, input.id);
	}

	/** 获取信息用于编辑修改 */
	async getLostDetail() {

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		let lost = await service.getLostDetail(input.id);
		if (lost) {
		}

		return lost;

	}

	/** 浏览详细 */
	async viewLost() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		let lost = await service.viewLost(this._userId, input.id);

		if (lost) {
			lost.LOST_ADD_TIME = timeUtil.timestamp2Time(lost.LOST_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (lost.LOST_LIKE_LIST
				&& Array.isArray(lost.LOST_LIKE_LIST)
				&& lost.LOST_LIKE_LIST.includes(this._userId))
				lost.like = true;
			else
				lost.like = false;

			// 删除冗余 
			if (lost.LOST_LIKE_LIST) delete lost.LOST_LIKE_LIST;
			if (lost.LOST_FAV_LIST) delete lost.LOST_FAV_LIST;
		}

		return lost;
	}

	/** 状态修改 */
	async statusLost() {
		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		return await service.statusLost(this._userId, input.id, input.status);

	}

	/** 列表与搜索 */
	async getLostList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		let result = await service.getLostList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].LOST_ADD_TIME = timeUtil.timestamp2Time(list[k].LOST_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (list[k].LOST_LIKE_LIST
				&& Array.isArray(list[k].LOST_LIKE_LIST)
				&& list[k].LOST_LIKE_LIST.includes(this._userId))
				list[k].like = true;
			else
				list[k].like = false;

			// 本人是否收藏
			if (list[k].LOST_FAV_LIST
				&& Array.isArray(list[k].LOST_FAV_LIST)
				&& list[k].LOST_FAV_LIST.includes(this._userId))
				list[k].fav = true;
			else
				list[k].fav = false;

			// 删除冗余
			if (list[k].LOST_OBJ.content) delete list[k].LOST_OBJ.content;
			if (list[k].LOST_LIKE_LIST) delete list[k].LOST_LIKE_LIST;
			if (list[k].LOST_FAV_LIST) delete list[k].LOST_FAV_LIST;
		}

		return result;

	}

	/** 发布 */
	async insertLost() {

		// 数据校验 
		let rules = {
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new LostService();
		let result = await service.insertLost(this._userId, input);

		return result;

	}

	/** 修改 */
	async editLost() {

		// 数据校验 
		let rules = {
			id: 'must|id',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new LostService();
		let result = await service.editLost(this._userId, input);

		return result;

	}

	/** 更新图片信息 */
	async updateLostForms() {

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new LostService();
		return await service.updateLostForms(input);
	}

	/** 删除 */
	async delLost() {

		// 数据校验
		let rules = {
			id: 'must|id',
			isAdmin: 'must|bool'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LostService();
		await service.delLost(this._userId, input.id);

	}

}

module.exports = LostController;