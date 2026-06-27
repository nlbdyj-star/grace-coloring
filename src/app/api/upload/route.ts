import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// 服务端 Supabase 客户端，用于上传文件到 Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "未提供文件" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: "未提供文件类型" }, { status: 400 });
    }

    // 生成存储路径: {type}/{timestamp}-{filename}
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${type}/${timestamp}-${sanitizedFilename}`;

    // 将 File 对象转换为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // 上传到 Supabase Storage 的 "media" bucket
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("media")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      // 如果 bucket 不存在，给出明确提示
      const msg = uploadError.message || "";
      if (msg.includes("Bucket not found") || msg.includes("does not exist") || msg.includes("bucket")) {
        return NextResponse.json(
          {
            error:
              'Storage bucket "media" 不存在或没有写入权限。请在 Supabase 后台：1) 创建名为 "media" 的 bucket 并设为 public；2) 添加匿名用户上传权限策略。',
          },
          { status: 500 }
        );
      }
      console.error("文件上传错误:", uploadError);
      return NextResponse.json(
        { error: `上传失败: ${msg}` },
        { status: 500 }
      );
    }

    // 获取公开 URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("media").getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrl,
      path: uploadData.path,
    });
  } catch (err: any) {
    console.error("上传 API 错误:", err);
    return NextResponse.json(
      { error: err?.message || "上传过程中发生未知错误" },
      { status: 500 }
    );
  }
}
