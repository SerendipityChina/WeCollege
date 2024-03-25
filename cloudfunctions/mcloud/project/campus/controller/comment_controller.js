/**
 * Notes: 评论模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-23 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const CommentService = require('../service/comment_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class CommentController extends BaseProjectController {

	/** 点赞 */
	async likeComment() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CommentService();
		return await service.likeComment(this._userId, input.id);
	}

	/** 列表 */
	async getCommentList() {

		// 数据校验
		let rules = {
			oid: 'string|must',
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

		let service = new CommentService();
		let result = await service.getCommentList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].COMMENT_ADD_TIME = timeUtil.timestamp2Time(list[k].COMMENT_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (list[k].COMMENT_LIKE_LIST
				&& Array.isArray(list[k].COMMENT_LIKE_LIST)
				&& list[k].COMMENT_LIKE_LIST.includes(this._userId))
				list[k].like = true;
			else
				list[k].like = false;

			// 删除冗余 
			if (list[k].COMMENT_LIKE_LIST) delete list[k].COMMENT_LIKE_LIST;
		}

		return result;

	}

	/** 发布 */
	async insertComment() {

		// 数据校验 
		let rules = {
			type: 'must|string',
			oid: 'must|string',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new CommentService();
		let result = await service.insertComment(this._userId, input);

		return result;

	}

	/** 更新图片信息 */
	async updateCommentForms() {

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new CommentService();
		return await service.updateCommentForms(input);
	}


	/** 删除 */
	async delComment() {

		// 数据校验
		let rules = {
			id: 'must|id',
			type: 'must|string',
			isAdmin: 'must|bool'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CommentService();
		if (input.isAdmin)
			await service.delComment(null, input.id);
		else
			await service.delComment(this._userId, input.id, input.type);

	}

}

module.exports = CommentController;